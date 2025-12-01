using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTO.Request;
using Service.DTO.Response;
using Service;
using Repository.Models;

namespace GustoSystemProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavouriteController : ControllerBase
    {
        private readonly FavouriteService _service;

        public FavouriteController(FavouriteService service)
        {
            _service = service;
        }

        [HttpGet("diner")]
        public async Task<ActionResult<List<RestaurantProfile>>> GetByDinerId()
        {
            var id = User.FindFirst("AccountID")?.Value;

            if (id == null)
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });
            var result = await _service.GetByDinerIdAsync(short.Parse(id));
            return Ok(result);
        }
        [HttpGet("GetAccountsLikeRes")]
        public async Task<ActionResult> GetAccountsLikeRes()
        {
            var id = User.FindFirst("AccountID")?.Value;

            if (id == null)
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });
            var result = await _service.GetAccountsLikeRes(short.Parse(id));
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FavouriteResponse>> GetById(short id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }
        [HttpGet("isLiked/{resId}")]
        public async Task<IActionResult> IsLiked(short resId)
        {
            var dinerId = User.FindFirst("AccountID")?.Value;
            var result = await _service.IsResLiked(short.Parse(dinerId),resId);
            if (result == false)
            {
                return Ok(new { result = result });
            }
            else
            {
                return Ok(new { result = result });
            }
                
        }

        [HttpPost]
        public async Task<IActionResult> Add(FavouriteRequest request)
        {
            var id = User.FindFirst("AccountID")?.Value;

            if (id == null)
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });
            request.DinerId = short.Parse(id);
            await _service.AddAsync(request);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(short id, FavouriteRequest request)
        {
            await _service.UpdateAsync(id, request);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(short id)
        {
            var dinerId = User.FindFirst("AccountID")?.Value;

            if (dinerId == null)
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });
            await _service.DeleteAsync(id, short.Parse(dinerId));
            return Ok();
        }
    }
}
