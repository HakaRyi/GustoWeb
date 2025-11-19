using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTO.Request;
using Service;

namespace GustoSystemProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromotionController : ControllerBase
    {
        private readonly PromotionService _promotionService;

        public PromotionController(PromotionService promotionService)
        {
            _promotionService = promotionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _promotionService.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(short id)
        {
            var promo = await _promotionService.GetByIdAsync(id);
            if (promo == null) return NotFound();
            return Ok(promo);
        }

        [HttpGet("code/{code}")]
        public async Task<IActionResult> GetByCode(string code)
        {
            var promo = await _promotionService.GetByCodeAsync(code);
            if (promo == null) return NotFound();
            return Ok(promo);
        }

        [HttpGet("account/{accountId}")]
        public async Task<IActionResult> GetByAccountId(short accountId)
        {
            var list = await _promotionService.GetByAccountIdAsync(accountId);
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] PromotionRequest request)
        {
            await _promotionService.AddAsync(request);
            return Ok("Promotion created successfully.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(short id, [FromBody] PromotionRequest request)
        {
            await _promotionService.UpdateAsync(id, request);
            return Ok("Promotion updated successfully.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(short id)
        {
            await _promotionService.DeleteAsync(id);
            return Ok("Promotion deleted successfully.");
        }
    }
}
