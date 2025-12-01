using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTO.Request;
using Service;

namespace GustoSystemProject.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Admin")] // Bật cái này lên để bảo mật
    public class AdminRestaurantTableController : ControllerBase
    {
        private readonly RestaurantTableService _service;

        public AdminRestaurantTableController(RestaurantTableService service)
        {
            _service = service;
        }

        [HttpPost("{restaurantId}")]
        public async Task<IActionResult> Create([FromRoute] int restaurantId, [FromBody] RestaurantTableRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                await _service.CreateTableAsync(request, (short)restaurantId);
                return Ok(new { message = "Admin created table successfully." });
            }
            catch (Exception ex) { return BadRequest(new { error = ex.Message }); }
        }

        [HttpPut("{restaurantId}/{tableId}")]
        public async Task<IActionResult> Update([FromRoute] int restaurantId, [FromRoute] int tableId, [FromBody] RestaurantTableRequest request)
        {
            try
            {
                await _service.UpdateTableAsync(request, tableId, (short)restaurantId);
                return Ok(new { message = "Admin updated table successfully." });
            }
            catch (Exception ex) { return BadRequest(new { error = ex.Message }); }
        }

        [HttpDelete("{restaurantId}/{tableId}")]
        public async Task<IActionResult> Delete([FromRoute] int restaurantId, [FromRoute] int tableId)
        {
            try
            {
                await _service.DeleteTableAsync(tableId, (short)restaurantId);
                return Ok(new { message = "Admin deleted table successfully." });
            }
            catch (Exception ex) { return BadRequest(new { error = ex.Message }); }
        }

        [HttpGet("getByRestaurant/{restaurantId}")]
        public async Task<IActionResult> GetByRestaurantId([FromRoute] int restaurantId)
        {
            // Lưu ý: Kiểm tra lại service của bạn có hàm GetByAccountAsync hay GetByRestaurantId
            // Ở đây tôi giả sử bạn dùng hàm lấy list table theo ID nhà hàng
            var result = await _service.GetByAccountAsync((short)restaurantId);
            return Ok(result);
        }
    }
}
