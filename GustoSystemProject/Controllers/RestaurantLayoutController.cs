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
        [HttpPost("createLayout")]
        public async Task<IActionResult> CreateAsync(RestaurantLayoutRequest request)
        {
            var restaurantID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await service.CreateLayoutAsync(request, short.Parse(restaurantID));
            return Ok("Layout successfully created.");
        }
        [HttpPut("updateLayout/{id}")]
        public async Task<IActionResult> UpdateAsync(RestaurantLayoutRequest request,[FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await service.UpdateLayoutAsync(request, id);
            return Ok("Layout successfully updated.");
        }
        [HttpDelete("deleteLayout/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await service.DeleteLayoutAsync(id);
            return Ok("Layout successfully deleted.");
        }
    }
}
