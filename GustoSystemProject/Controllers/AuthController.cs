using Azure.Core;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Service;
using Service.DTO.Request;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Twilio;
using Twilio.Rest.Verify.V2.Service;
using Twilio.Types;
using LoginRequest = Service.DTO.Request.LoginRequest;

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

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // 1. Đọc tài khoản Admin từ appsettings.json
            var adminUser = _configuration["AdminSettings:UserName"];
            var adminPass = _configuration["AdminSettings:Password"];

            // 2. Kiểm tra thông tin đăng nhập
            if (request.UserName == adminUser && request.Password == adminPass)
            {
                // 3. Tạo Token quyền Admin
                var tokenString = GenerateJwtToken(adminUser, "Admin", "1"); // ID giả định là 1

                return Ok(new
                {
                    token = tokenString,
                    role = "Admin",
                    message = "Đăng nhập Admin thành công (Config)!"
                });
            }

            // Nếu không phải Admin, trả về lỗi (hoặc bạn có thể thêm logic check DB ở đây sau này)
            return Unauthorized(new { message = "Sai tên đăng nhập hoặc mật khẩu" });
        }

        // Hàm tạo JWT Token riêng biệt cho gọn
        private string GenerateJwtToken(string username, string role, string accountId)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Role, role),       // Quan trọng: Role Admin
                    new Claim("AccountID", accountId)       // Claim ID
                }),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryInMinutes"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
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
