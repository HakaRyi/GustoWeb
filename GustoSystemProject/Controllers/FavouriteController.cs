using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTO.Request;
using Service.DTO.Response;
using Service;

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

        [HttpGet("diner/{dinerId}")]
        public async Task<ActionResult<List<FavouriteResponse>>> GetByDinerId(short dinerId)
        {
            var result = await _service.GetByDinerIdAsync(dinerId);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FavouriteResponse>> GetById(short id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add(FavouriteRequest request)
        {
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
            await _service.DeleteAsync(id);
            return Ok();
        }
    }
}
