using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace GustoSystemProject.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")] 
    public class AdminFoodReviewController : ControllerBase
    {
        private readonly FoodReviewService _service;

        public AdminFoodReviewController(FoodReviewService service)
        {
            _service = service;
        }

        // 1. Xem danh sách tất cả đánh giá
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.AdminGetAllAsync();
            return Ok(result);
        }

        // 2. Xóa đánh giá (Bất chấp chủ sở hữu)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(short id)
        {
            var success = await _service.AdminDeleteAsync(id);
            if (!success) return NotFound("Review not found.");

            return Ok(new { message = "Deleted successfully" });
        }
    }
}