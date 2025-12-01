using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace GustoSystemProject.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminContactController : ControllerBase
    {
        private readonly ContactService _service;

        public AdminContactController(ContactService service)
        {
            _service = service;
        }

        // 1. Lấy tất cả tin nhắn (Mới nhất lên đầu)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var contacts = await _service.GetAll();
            // Sắp xếp giảm dần theo thời gian (Id lớn nhất hoặc Timestamp)
            var sortedContacts = contacts.OrderByDescending(c => c.Timestamp).ToList();
            return Ok(sortedContacts);
        }

        // 2. Xóa tin nhắn
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.Delete(id);
            if (result) return Ok(new { message = "Deleted successfully" });
            return NotFound("Contact not found");
        }

        // 3. Gửi Email trả lời (Nếu bạn có EmailService)
        // [HttpPost("reply")]
        // public async Task<IActionResult> Reply([FromBody] ReplyRequest request) { ... }
    }
}