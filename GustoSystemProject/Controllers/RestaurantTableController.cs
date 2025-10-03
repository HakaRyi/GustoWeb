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
        [HttpPost("createTable")]
        public async Task<IActionResult> CreateAsync(RestaurantTableRequest request)
        {
            var restaurantID = User.FindFirst("AccountID")?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await service.CreateTableAsync(request, short.Parse(restaurantID));
            return Ok(new
            {
                message = "Table successfully created."
            });
        }
        [HttpPut("updateTable/{id}")]
        public async Task<IActionResult> UpdateAsync(RestaurantTableRequest request, [FromRoute] int id)
        {
            var restaurantID = User.FindFirst("AccountID")?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
           
            try
            {
                await service.UpdateTableAsync(request, id, short.Parse(restaurantID));
                return Ok(new
                {
                    message = "Table successfully updated."
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
        [HttpDelete("deleteTable/{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            var restaurantID = User.FindFirst("AccountID")?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await service.DeleteTableAsync(id, short.Parse(restaurantID));
                return Ok(new
                {
                    message = "Table successfully deleted."
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
