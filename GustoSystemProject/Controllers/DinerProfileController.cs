using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTO.Request;
using Service;

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
        public async Task<IActionResult> GetById(short id)
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

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(short id, [FromBody] DinerProfileRequest request)
        {
            var success = await _service.UpdateAsync(id, request);
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
    }
}
