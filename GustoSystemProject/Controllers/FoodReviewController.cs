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
        public async Task<IActionResult> Add([FromBody] FoodReviewRequest request)
        {
            var result = await _service.AddAsync(request);
            return CreatedAtAction(nameof(GetByFoodId), new { foodId = result.FoodId }, result);
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

        [HttpPut("{reviewId}")]
        public async Task<IActionResult> Update(short reviewId, [FromBody] FoodReviewRequest request)
        {
            var result = await _service.UpdateAsync(reviewId, request);
            if (result == null) return NotFound("Review not found");
            return Ok(result);
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
