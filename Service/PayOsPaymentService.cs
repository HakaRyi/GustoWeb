//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using Microsoft.Extensions.Options;
//using Net.payOS;
//using Net.payOS.Errors;
//using Net.payOS.Types;
//using Repository;
//using Service.Config;

//namespace Service
//{
//    public class PayOsPaymentService
//    {
//        private readonly PayOS _payOs;
//        private readonly OrderRepository _orderRepo;

//        public PayOsPaymentService(IOptions<PayOsSettings> settings,OrderRepository orderRepo,)
//        {
//            var config = settings.Value;
//            _payOs = new PayOS(config.ClientId, config.ApiKey, config.ChecksumKey);
//            _orderRepo = orderRepo;
//        }

//        /// <summary>
//        /// Tạo link thanh toán PayOS
//        /// </summary>
//        public async Task<string> CreatePaymentUrlAsync(int orderId, decimal amount, string returnUrl)
//        {
//            var order = _orderRepo.GetById(orderId);
//            if (order == null)
//                throw new Exception($"Order not found with ID = {orderId}");
//            long orderCode = orderId;

//            //Danh sách sản phẩm
//            var itemList = order.OrderDetails.Select(od => new ItemData(
//                od.Product?.Name ?? "Sản phẩm",
//                od.Quantity,
//                (int)od.PriceAtPurchase
//            )).ToList();

//            var paymentData = new PaymentData(
//                orderCode: orderCode,
//                amount: (int)amount,
//                description: $"Thanh toán đơn hàng #{orderId}",
//                items: itemList,
//                cancelUrl: "https://localhost:3000/cart",
//                returnUrl: $"https://localhost:3000/success?status=paid"
//            );

//            try
//            {
//                var result = await _payOs.createPaymentLink(paymentData);
//                Console.WriteLine($"Created PayOS payment link for order {orderId} with orderCode={orderCode}");
//                return result.checkoutUrl;
//            }
//            catch (PayOSError ex)
//            {
//                throw new ApplicationException("Lỗi khi tạo link thanh toán PayOS: " + ex.Message);
//            }
//        }


//        //xử lý Webhook từ PayOS

//        public WebhookData VerifyWebhook(WebhookType webhookBody)
//        {
//            Console.WriteLine("Webhook received, verifying...");

//            var data = _payOs.verifyPaymentWebhookData(webhookBody);
//            if (data == null)
//            {
//                Console.WriteLine("verifyPaymentWebhookData returned null");
//                return null;
//            }

//            Console.WriteLine($"Webhook verified: {System.Text.Json.JsonSerializer.Serialize(data)}");

//            if (data.code != "00")
//            {
//                Console.WriteLine($"Payment not successful (code={data.code})");
//                return null;
//            }

//            //h orderCode chính là orderId
//            int orderId = (int)data.orderCode;

//            var order = _orderRepo.GetById(orderId);
//            if (order == null)
//            {
//                Console.WriteLine($"Order not found: {orderId}");
//                return null;
//            }

//            // Cập nhật trạng thái thanh toán
//            order.Status = "Paid";
//            _orderRepo.Update(order);
//            Console.WriteLine($"Order {orderId} marked as Paid");
//            Console.WriteLine($"Webhook xử lý thành công cho orderId {orderId}");
//            return data;
//        }
//    }
//}
