using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Service;
using Service.DTO.Request;

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantProfileController : ControllerBase
    {
        private readonly RestaurantProfileService service;
        public RestaurantProfileController(RestaurantProfileService service)
        {
            this.service = service;
        }
        //[HttpGet]
        //public async Task<List<RestaurantProfile>> GetAll()
        //{
        //    return await service.GetAllAsync1();
        //}
        [HttpGet("getAllResPro")]
        public async Task<IActionResult> GetAllProfiles()
        {
            var profiles = await service.GetAllAsync2();
            if (profiles == null || !profiles.Any())
            {
                return NotFound();
            }
            return Ok(profiles);
        }
        //[HttpGet("{id}")]
        //public async Task<RestaurantProfile> GetByIdAsync([FromRoute] int id)
        //{
        //    return await service.GetByIdAsync(id);
        //}
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetByProfileIdAsync([FromRoute] int id)
        {
            var item = await service.GetByIdAsync2(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }
        [HttpGet("getByMyRestaurant")]
        public async Task<IActionResult> GetByMyRestaurant()
        {
            var restaurantID = User.FindFirst("AccountID")?.Value;
            var item = await service.GetByAccountAsync(short.Parse(restaurantID));
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }
        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateProfile([FromBody] RestaurantProfileRequest request)
        {
            try
            {
                var accId = User.FindFirst("AccountID")?.Value;

                var result = await service.CreateProfileAsync(request, short.Parse(accId));
                return Ok(new { message = "Restaurant profile created successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpPut("updateProfile/{id}")]
        public async Task<IActionResult> UpdateAsync(RestaurantProfileRequest request, [FromRoute] int id)
        {
            var restaurantID = User.FindFirst("AccountID")?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await service.UpdateProfileAsync(request, id, short.Parse(restaurantID));
                return Ok(new
                {
                    message = "Profile successfully updated."
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpDelete("deleteProfile/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            var restaurantID = User.FindFirst("AccountID")?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await service.DeleteProfileAsync(id, short.Parse(restaurantID));
                return Ok(new
                {
                    message = "Profile successfully deleted."
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
