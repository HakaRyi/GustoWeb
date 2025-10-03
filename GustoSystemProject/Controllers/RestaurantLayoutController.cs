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
    public class RestaurantLayoutController : ControllerBase
    {
        private readonly RestaurantLayoutService service;
        public RestaurantLayoutController(RestaurantLayoutService service)
        {
            this.service = service;
        }
        //[HttpGet]
        //public async Task<List<RestaurantLayout>> GetAll()
        //{
        //    return await service.GetAllAsync1();
        //}
        [HttpGet("getAllResLayout")]
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
        //public async Task<RestaurantLayout> GetByIdAsync([FromRoute] int id)
        //{
        //    return await service.GetByIdAsync(id);
        //}
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetByLayoutIdAsync([FromRoute] int id)
        {
            var item = await service.GetByIdAsync2(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }
        [HttpGet("getByMyRestaurant")]
        [Authorize]
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
        [HttpPost("createLayout")]
        [Authorize]
        public async Task<IActionResult> CreateAsync([FromBody] RestaurantLayoutRequest request)
        {
            var restaurantID = User.FindFirst("AccountID")?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await service.CreateLayoutAsync(request, short.Parse(restaurantID));
                return Ok(new
                {
                    message = "Layout successfully created."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPut("updateLayout/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateAsync([FromBody] RestaurantLayoutRequest request,[FromRoute] int id)
        {
            var restaurantID = User.FindFirst("AccountID")?.Value;
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await service.UpdateLayoutAsync(request, id, short.Parse(restaurantID));
                return Ok(new
                {
                    message = "Layout successfully updated."
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
        [HttpDelete("deleteLayout/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            var restaurantID = User.FindFirst("AccountID")?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await service.DeleteLayoutAsync(id, short.Parse(restaurantID));
                return Ok(new
                {
                    message = "Layout successfully deleted."
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
