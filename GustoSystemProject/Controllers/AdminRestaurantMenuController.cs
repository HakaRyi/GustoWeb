using Microsoft.AspNetCore.Mvc;
using Service.DTO.Request;
using Service;

namespace GustoSystemProject.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Admin")] // Bật cái này lên để bảo mật
    public class AdminRestaurantMenuController : ControllerBase
    {
        private readonly RestaurantMenuService _service;

        public AdminRestaurantMenuController(RestaurantMenuService service)
        {
            _service = service;
        }

        // 1. Create: Admin tạo món cho nhà hàng cụ thể (truyền ID nhà hàng trên URL)
        [HttpPost("{restaurantId}")]
        public async Task<IActionResult> Create([FromRoute] int restaurantId, [FromBody] RestaurantMenuRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                // Gọi Service, truyền ID nhà hàng vào tham số thứ 2
                await _service.CreateMenuAsync(request, (short)restaurantId);
                return Ok(new { message = "Admin created menu successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // 2. Update: Admin sửa món (truyền ID món và ID nhà hàng để check quyền sở hữu nếu cần)
        // Lưu ý: Service UpdateMenuAsync của bạn đang cần tham số restaurantID để check owner.
        // Với Admin, ta cứ truyền restaurantId vào để service không bị lỗi logic.
        [HttpPut("{restaurantId}/{menuId}")]
        public async Task<IActionResult> Update([FromRoute] int restaurantId, [FromRoute] int menuId, [FromBody] RestaurantMenuRequest request)
        {
            try
            {
                await _service.UpdateMenuAsync(request, menuId, (short)restaurantId);
                return Ok(new { message = "Admin updated menu successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // 3. Delete
        [HttpDelete("{restaurantId}/{menuId}")]
        public async Task<IActionResult> Delete([FromRoute] int restaurantId, [FromRoute] int menuId)
        {
            try
            {
                await _service.DeleteMenuAsync(menuId, (short)restaurantId);
                return Ok(new { message = "Admin deleted menu successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // 4. Get By Restaurant (Dùng lại logic cũ nhưng expose ra route admin)
        [HttpGet("getByRestaurant/{restaurantId}")]
        public async Task<IActionResult> GetByRestaurantId([FromRoute] int restaurantId)
        {
            var result = await _service.GetByRestaurantId(restaurantId);
            return Ok(result);
        }
    }
}
