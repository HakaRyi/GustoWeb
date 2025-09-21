using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Service;

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
    }
}
