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
    public class RestaurantMenuController : ControllerBase
    {
        private readonly RestaurantMenuService service;
        public RestaurantMenuController(RestaurantMenuService service)
        {
            this.service = service;
        }
        //[HttpGet]
        //public async Task<List<RestaurantMenu>> GetAll()
        //{
        //    return await service.GetAllAsync1();
        //}
        [HttpGet("getAllResMenu")]
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
        //public async Task<RestaurantMenu> GetByIdAsync([FromRoute] int id)
        //{
        //    return await service.GetByIdAsync(id);
        //}
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetByMenuIdAsync([FromRoute] int id)
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
        [HttpPost("createMenu")]
        public async Task<IActionResult> CreateAsync(RestaurantMenuRequest request)
        {
            var restaurantID = User.FindFirst("AccountID")?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await service.CreateMenuAsync(request, short.Parse(restaurantID));
            return Ok(new
            {
                message = "Food successfully created."
            });
        }
        [HttpPut("updateMenu/{id}")]
        public async Task<IActionResult> UpdateAsync(RestaurantMenuRequest request, [FromRoute] int id)
        {
            var restaurantID = User.FindFirst("AccountID")?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await service.UpdateMenuAsync(request, id, short.Parse(restaurantID));
                return Ok(new
                {
                    message = "Food successfully updated."
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
        [HttpDelete("deleteMenu/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            var restaurantID = User.FindFirst("AccountID")?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }    
            try
            {
                await service.DeleteMenuAsync(id, short.Parse(restaurantID));
                return Ok(new
                {
                    message = "Food successfully deleted."
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
