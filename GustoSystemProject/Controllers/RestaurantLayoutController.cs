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
    }
}
