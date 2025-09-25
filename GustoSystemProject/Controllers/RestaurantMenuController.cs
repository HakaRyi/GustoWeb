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
            var restaurantID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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
            var restaurantID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await service.CreateMenuAsync(request, short.Parse(restaurantID));
            return Ok("Food successfully created.");
        }
        [HttpPut("updateMenu/{id}")]
        public async Task<IActionResult> UpdateAsync(RestaurantMenuRequest request, [FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await service.UpdateMenuAsync(request, id);
            return Ok("Food successfully updated.");
        }
        [HttpDelete("deleteMenu/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await service.DeleteMenuAsync(id);
            return Ok("Food successfully deleted.");
        }
    }
}
