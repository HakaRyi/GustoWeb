using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.DTO.Request;
using System.Security.Claims;
using System.Threading.Tasks;

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DinerProfileController : ControllerBase
    {
        private readonly DinerProfileService _service;

        public DinerProfileController(DinerProfileService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(short id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound(new { message = "Không tìm thấy hồ sơ" });
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DinerProfileRequest request)
        {
            var success = await _service.AddAsync(request);
            if (!success) return BadRequest(new { message = "Tạo thất bại" });
            return Ok(new { message = "Tạo thành công" });
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] DinerProfileRequest request)
        {
            var id = User.FindFirst("AccountID")?.Value;

            if (id == null)
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });
            var success = await _service.UpdateAsync(short.Parse(id), request);
            if (!success) return NotFound(new { message = "Không tìm thấy để cập nhật" });
            return Ok(new { message = "Cập nhật thành công" });
        }

        [HttpPut("uploadAvt")]
        public async Task<IActionResult> UpdateAvt([FromBody] string avtUrl)
        {
            var id = User.FindFirst("AccountID")?.Value;

            if (id == null)
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });
            var success = await _service.UpdateAvtAsync(avtUrl, short.Parse(id));
            if (!success) return NotFound(new { message = "Không tìm thấy để cập nhật" });
            return Ok(new { message = "Cập nhật thành công" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(short id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound(new { message = "Không tìm thấy để xóa" });
            return Ok(new { message = "Xóa thành công" });
        }

        //Other Operations:
        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBooking()
        {
            var id = User.FindFirst("AccountID")?.Value;

            if (id == null)
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });
            var user = await _service.GetByIdAsync(short.Parse(id));
            if (user == null) return NotFound("Không tìm thấy người dùng trong cơ sở dữ liệu");
            return Ok(user.Bookings);
        }
    }
}
