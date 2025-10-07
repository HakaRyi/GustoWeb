using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.DTO.Request;
using Twilio;
using Twilio.Rest.Verify.V2.Service;
using Twilio.Types;

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AuthController : Controller
    {
        private readonly SpeedSmsService _smsService;
        private readonly IConfiguration _configuration;

        public AuthController(SpeedSmsService smsService, IConfiguration config)
        {
            _smsService = smsService;
            _configuration = config;
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] string phoneNumber)
        {
            try
            {

                // 1️⃣ Tạo mã OTP ngẫu nhiên
                var random = new Random();
                var otp = random.Next(100000, 999999).ToString();

                string token = _configuration["SpeedSMS:AccessToken"];

                SpeedSMSAPI api = new SpeedSMSAPI(token);
                string userInfo = api.getUserInfo();
                string[] phones = new String[] { phoneNumber };
                int type = 2;

                // 3️⃣ Nội dung tin nhắn
                var content = $"Gusto: Mã OTP của bạn là {otp}. Không chia sẻ mã này cho ai.";


                // 4️⃣ Gửi SMS qua SpeedSMS
                string response = api.sendSMS(phones, content, type, "");

                // 5️⃣ Trả về kết quả
                return Ok(new { otp, response });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
