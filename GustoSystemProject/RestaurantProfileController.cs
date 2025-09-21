using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Service;

namespace GustoSystemProject
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
        [HttpGet]
        public async Task<List<RestaurantProfile>> GetAll()
        {
            return await service.GetAllAsync1();
        }
        [HttpGet("getAllResPro")]
        public async Task<IActionResult> GetAllAccounts()
        {
            var profiles = await service.GetAllAsync2();
            if (profiles == null || !profiles.Any())
            {
                return NotFound();
            }
            return Ok(profiles);
        }
    }
}
