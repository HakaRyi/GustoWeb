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
    public class RestaurantTableController : ControllerBase
    {
        private readonly RestaurantTableService service;
        public RestaurantTableController(RestaurantTableService service)
        {
            this.service = service;
        }
        //[HttpGet]
        //public async Task<List<RestaurantTable>> GetAll()
        //{
        //    return await service.GetAllAsync1();
        //}
        [HttpGet("getAllResTable")]
        public async Task<IActionResult> GetAllProfiles()
        {
            var table = await service.GetAllAsync2();
            if (table == null || !table.Any())
            {
                return NotFound();
            }
            return Ok(table);
        }
        //[HttpGet("{id}")]
        //public async Task<RestaurantTable> GetByIdAsync([FromRoute] int id)
        //{
        //    return await service.GetByIdAsync(id);
        //}
        [HttpGet("getByTableId/{id}")]
        public async Task<IActionResult> GetByTableIdAsync([FromRoute] int id)
        {
            var table = await service.GetByIdAsync2(id);
            if (table == null)
            {
                return NotFound();
            }
            return Ok(table);
        }
    }
}
