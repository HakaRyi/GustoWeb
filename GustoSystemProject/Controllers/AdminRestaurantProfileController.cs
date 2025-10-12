using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.DTO.Request;
using Service;

namespace GustoSystemProject.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    //[Authorize(Roles = "Admin")] // chỉ Admin được quyền CRUD
    public class AdminRestaurantProfileController : ControllerBase
    {
        private readonly RestaurantProfileService _service;

        public AdminRestaurantProfileController(RestaurantProfileService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync2();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync2(id);
            if (result == null) return NotFound($"RestaurantProfile with ID {id} not found.");
            return Ok(result);
        }

        [HttpPost("{accId}")]
        public async Task<IActionResult> Create(short accId, [FromBody] RestaurantProfileRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _service.AdminCreateProfileAsync(request, accId);
                if (result > 0)
                    return Ok("Restaurant profile created successfully.");
                return BadRequest("Failed to create restaurant profile.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{profileId}")]
        public async Task<IActionResult> Update(int profileId, [FromBody] RestaurantProfileRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _service.AdminUpdateProfileAsync(profileId, request);
                if (result > 0)
                    return Ok("Restaurant profile updated successfully.");
                return BadRequest("Failed to update restaurant profile.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await _service.AdminDeleteProfileAsync(id);
                if (result > 0)
                    return Ok("Restaurant profile deleted successfully.");
                return BadRequest("Failed to delete restaurant profile.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
