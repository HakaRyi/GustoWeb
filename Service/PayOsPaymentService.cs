using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Net.payOS;
using Net.payOS.Errors;
using Net.payOS.Types;
using Repository;
using Repository.Models;
using Service.Config;
using Service.DTO.Request;
using Transaction = Repository.Models.Transaction;

namespace Service
{
    public class PayOsPaymentService
    {
        private readonly PayOS _payOs;
        private readonly OrderRepository _orderRepo;
        private readonly TransactionService _transactionService;
        private readonly NotificationService _notificationService;
        public PayOsPaymentService(IOptions<PayOsSettings> settings, OrderRepository orderRepo, TransactionService transactionService, NotificationService notificationService)
        {
            var config = settings.Value;
            _payOs = new PayOS(config.ClientId, config.ApiKey, config.ChecksumKey);
            _orderRepo = orderRepo;
            _transactionService = transactionService;
            _notificationService = notificationService;
        }

        /// <summary>
        /// Tạo link thanh toán PayOS
        /// </summary>
        public async Task<string> CreatePaymentUrlAsync(short orderId, decimal amount, string returnUrl)
        {
            var order = await _orderRepo.GetOrderAsync(orderId);
            if (order == null)
                throw new Exception($"Order not found with ID = {orderId}");

            long orderCode = long.Parse($"{orderId}{DateTime.UtcNow:MMddHHmmss}");

            //Danh sách sản phẩm
            var itemList =  order.OrderDetails.Select(od => new ItemData(
                od.Food?.Name ?? "Sản phẩm",
                od.NumberOfFood,
                (int)(od.FoodPrice ?? 0)
            )).ToList();

            var paymentData = new PaymentData(
                orderCode: orderCode,
                amount: (int)amount,
                description: $"don hang #{orderId}-Gusto",
                items: itemList,
                cancelUrl: "https://www.gustoweb.site/restaurants/",
                returnUrl: $"https://www.gustoweb.site/profile/bkh"
            );

            try
            {
                var result = await _payOs.createPaymentLink(paymentData);
                Console.WriteLine($"Created PayOS payment link for order {orderId} with orderCode={orderCode}");
                return result.checkoutUrl;
            }
            catch (PayOSError ex)
            {
                Console.WriteLine("Lỗi PayOS: " + ex.ToString());
                throw new ApplicationException("Lỗi khi tạo link thanh toán PayOS: " + ex.Message);
            }
        }


        //xử lý Webhook từ PayOS
        public async Task<WebhookData> VerifyWebhook(WebhookType webhookBody)
        {
            Console.WriteLine("Webhook received, verifying...");

            var data = _payOs.verifyPaymentWebhookData(webhookBody);
            if (data == null)
            {
                Console.WriteLine("verifyPaymentWebhookData returned null");
                return null;
            }

            Console.WriteLine($"Webhook verified: {System.Text.Json.JsonSerializer.Serialize(data)}");

            if (data.code != "00")
            {
                Console.WriteLine($"Payment not successful (code={data.code})");
                return null;
            }
            string orderCodeStr = data.orderCode.ToString();


            string orderIdStr = orderCodeStr[..^10]; //bo 10 ky tu cuoi
            short orderId = short.Parse(orderIdStr);

            Console.WriteLine($"Extracted orderId = {orderId} from orderCode = {data.orderCode}");

            var order = await _orderRepo.GetOrderAsync(orderId);
            if (order == null)
            {
                Console.WriteLine($"Order not found: {orderId}");
                return null;
            }

            order.Status = "Paid";
            order.Booking.Status = "booked";
            

            var transaction = new Transaction
            {
                BookingId = order.Booking.BookingId,
                TotalAmount = (decimal)order.FinalPrice,
                Timestamp = DateTime.UtcNow,
            };
            await _transactionService.Create(transaction);
            await _orderRepo.UpdateAsync(order);
            try
            {
                var diner = order.Booking.Diner;
                if (string.IsNullOrEmpty(diner.Email))
                {
                    Console.WriteLine("Không có email khách hàng, bỏ qua gửi mail");
                }
                else
                {
                    var emailRequest = new SendEmailRequest
                    {
                        ReceiverName = diner.FullName ?? "Khách hàng",
                        ReceiverMail = diner.Email,
                        Subject = "Thanh toán thành công – Gusto",
                        Messenger = $@"
<!DOCTYPE html>
<html>
<body style=""font-family: Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 20px; background: #f9f9f9;"">
    <div style=""max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"">
        <!-- Header xanh olive -->
        <div style=""background: linear-gradient(135deg, #6a7636, #5a662e); padding: 30px; text-align: center; color: white;"">
            <h1 style=""margin: 0; font-size: 28px;"">Thanh toán thành công!</h1>
            <p style=""margin: 10px 0 0; font-size: 16px;"">Cảm ơn bạn đã tin tưởng Gusto</p>
        </div>
        
        <div style=""padding: 30px;"">
            <h2 style=""color: #2c3e50;"">Chào {diner.FullName ?? "bạn"},</h2>
            
            <!-- Khối thông tin giao dịch -->
            <div style=""background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #6a7636;"">
                <h3 style=""margin: 0 0 15px 0; color: #2c3e50;"">Chi tiết giao dịch</h3>
                <table style=""width: 100%; font-size: 15px;"">
                    <tr><td style=""padding: 8px 0;""><strong>Mã đơn:</strong></td><td>#{order.OrderId}</td></tr>
                    <tr><td style=""padding: 8px 0;""><strong>Nhà hàng:</strong></td><td>{order.Booking.Restaurant.FullName}</td></tr>
                    <tr><td style=""padding: 8px 0;""><strong>Bàn:</strong></td><td>{order.Booking.Table.Name}</td></tr>
                    <tr><td style=""padding: 8px 0;""><strong>Thời gian:</strong></td><td>{order.Booking.StartTime:dd/MM/yyyy HH:mm}</td></tr>
                    <tr><td style=""padding: 8px 0;""><strong>Số tiền:</strong></td>
                        <td style=""color: #6a7636; font-size: 18px; font-weight: bold;"">{order.FinalPrice:N0} VND</td></tr>
                </table>
            </div>

            <p style=""font-size: 16px;"">
                Thực đơn đang được chuẩn bị<br/>
                <strong>Chúng tôi sẽ gọi bạn khi sẵn sàng!</strong>
            </p>

            <!-- Nút CTA xanh olive -->
            <div style=""text-align: center; margin: 35px 0;"">
                <a href=""https://gustoweb.site/profile/bkh""
                   style=""background: #6a7636; color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; 
                          font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(106,118,54,0.3);"">
                   Xem chi tiết đặt chỗ
                </a>
            </div>

            <hr style=""border: 0; border-top: 1px solid #eee; margin: 40px 0;""/>

            <p style=""text-align: center; color: #7f8c8d;"">
                Trân trọng,<br/>
                <strong style=""color: #2c3e50;"">Gusto Team</strong> – <em>Say it, Savor it</em><br/>
                <a href=""https://gustoweb.site"" style=""color: #6a7636;"">gustoweb.site</a>
            </p>
        </div>
    </div>
</body>
</html>"
.Trim()
                    };

                    await _notificationService.SendEmailAsync2(emailRequest);
                    Console.WriteLine($"Đã gửi email thành công đến: {diner.Email}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Gửi email thất bại (không ảnh hưởng webhook): {ex.Message}");
                // Không throw → webhook vẫn trả 200 OK
            }
            Console.WriteLine($"Order {orderId} marked as Paid");
            Console.WriteLine($"Webhook xử lý thành công cho orderId {orderId}");

            return data;
        }

    }
}
