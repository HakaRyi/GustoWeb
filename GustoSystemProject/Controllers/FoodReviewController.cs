using Microsoft.AspNetCore.Mvc;
using Service.DTO.Request;
using Service;

namespace GustoSystemProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodReviewController : ControllerBase
    {
        private readonly FoodReviewService _service;

        public FoodReviewController(FoodReviewService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] FeedbackRequest request)
        {
            if (request == null || request.Feedbacks == null || !request.Feedbacks.Any())
                return BadRequest("Invalid feedback data.");
            var id = short.Parse(User.FindFirst("AccountID")?.Value);

            if (id == null)
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });
            foreach (var feedback in request.Feedbacks)
            {
                feedback.DinerId = id;
            }

            await _service.AddAsync(request);
            return Ok(new { message = "Feedbacks created successfully." });
        }

        [HttpGet("ByFood/{foodId}")]
        public async Task<IActionResult> GetByFoodId(short foodId)
        {
            var result = await _service.GetByFoodIdAsync(foodId);
            return Ok(result);
        }

        [HttpGet("ByDiner/{dinerId}")]
        public async Task<IActionResult> GetByDinerId(short dinerId)
        {
            var result = await _service.GetByDinerIdAsync(dinerId);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update(short reviewId, [FromBody] FeedbackRequest request)
        {
            if (request == null || request.Feedbacks == null || !request.Feedbacks.Any())
                return BadRequest("Invalid feedback data.");
            var id = short.Parse(User.FindFirst("AccountID")?.Value);

            if (id == null)
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });
            foreach (var feedback in request.Feedbacks)
            {
                feedback.DinerId = id;
            }

            await _service.UpdateFeedbacksAsync(request);
            return Ok(new { message = "Feedbacks updated successfully." });
        }

        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> Delete(short reviewId, [FromQuery] short dinerId)
        {
            var success = await _service.DeleteAsync(reviewId, dinerId);
            if (!success) return NotFound("Review not found or not authorized");
            return NoContent();
        }
    }
}
