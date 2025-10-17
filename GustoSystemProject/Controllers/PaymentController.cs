using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Net.payOS.Types;
using Service;
using Service.DTO.Request;

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PayOsPaymentService _payOsService;
        public PaymentController(PayOsPaymentService payOsService)
        {
            _payOsService = payOsService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
        {
            var url = await _payOsService.CreatePaymentUrlAsync(request.OrderId, request.Amount, request.ReturnUrl);
            return Ok(new { checkoutUrl = url });
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook([FromBody] WebhookType webhookBody)
        {
            try
            {
                Console.WriteLine("Webhook received raw: " + System.Text.Json.JsonSerializer.Serialize(webhookBody));

                var data = await _payOsService.VerifyWebhook(webhookBody);

                if (data == null)
                {
                    Console.WriteLine("Webhook invalid or test ping, returning 200 OK anyway");
              
                    return Ok(new { success = true, message = "Webhook test or invalid data ignored" });
                }
                Console.WriteLine("Webhook valid - order updated");
                return Ok(new { success = true, message = "Webhook processed successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Webhook error: " + ex.Message);
                return Ok(new { success = false, error = ex.Message });
            }
        } 
     }
}
