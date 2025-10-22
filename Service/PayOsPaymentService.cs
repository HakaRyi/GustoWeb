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
using Transaction = Repository.Models.Transaction;

namespace Service
{
    public class PayOsPaymentService
    {
        private readonly PayOS _payOs;
        private readonly OrderRepository _orderRepo;
        private readonly TransactionService _transactionService;

        public PayOsPaymentService(IOptions<PayOsSettings> settings, OrderRepository orderRepo, TransactionService transactionService)
        {
            var config = settings.Value;
            _payOs = new PayOS(config.ClientId, config.ApiKey, config.ChecksumKey);
            _orderRepo = orderRepo;
            _transactionService = transactionService;
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
                cancelUrl: "http://localhost:3000/restaurants/",
                returnUrl: $"http://localhost:3000/profile/bkh"
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

            Console.WriteLine($"Order {orderId} marked as Paid");
            Console.WriteLine($"Webhook xử lý thành công cho orderId {orderId}");

            return data;
        }

    }
}
