using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace GustoSystemProject.Controllers
{
    // Tạo class để nhận dữ liệu từ Frontend gửi lên
    public class ReplyRequest
    {
        //gui email nha don
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
    }

    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminContactController : ControllerBase
    {
        private readonly ContactService _contactService;
        private readonly EmailService _emailService; 

        public AdminContactController(ContactService contactService, EmailService emailService)
        {
            _contactService = contactService;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var contacts = await _contactService.GetAll();
            var sortedContacts = contacts.OrderByDescending(c => c.Timestamp).ToList();
            return Ok(sortedContacts);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _contactService.Delete(id);
            if (result) return Ok(new { message = "Deleted successfully" });
            return NotFound("Contact not found");
        }

        [HttpPost("reply")]
        public async Task<IActionResult> Reply([FromBody] ReplyRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Message))
            {
                return BadRequest("Email và nội dung không được để trống.");
            }

            try
            {
                await _emailService.SendEmailAsync(request.Email, request.Subject, request.Message);
                return Ok(new { message = "Email sent successfully" });
            }
            catch (Exception ex)
            {
                var errorDetail = ex.Message;

                // Kiểm tra xem có lỗi ngầm bên trong không (thường lý do nằm ở đây)
                if (ex.InnerException != null)
                {
                    errorDetail += " || INNER ERROR: " + ex.InnerException.Message;
                }

                // Trả về BadRequest (400) thay vì 500 để dễ đọc lỗi trên Frontend
                return BadRequest(new { error = errorDetail, fullStack = ex.ToString() });
            }
        }
    }
}