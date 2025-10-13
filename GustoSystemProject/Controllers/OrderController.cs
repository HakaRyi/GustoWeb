using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Service;
using Service.DTOs.Request;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _service;
        public OrderController(OrderService service)
        {
            _service = service;
        }
        // GET: api/<OrderController>
        [HttpGet("getAllOrder")]
        public async Task<List<Order>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET api/<OrderController>/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<Order> GetByIdAsync(short id)
        {
            return await _service.GetOrderAsync(id);
        }

        // POST api/<OrderController>
        [HttpPost]
        [Authorize]
        public async Task<int> Post(Order order)
        {
            if (ModelState.IsValid)
            {
                return await _service.CreateAsync(order);
            }
            return 0;
        }

        // PUT api/<OrderController>/5
        [HttpPut("{orderId}")]
        [Authorize]
        public async Task<int> Put([FromRoute]short orderId)
        {
            var accId = User.FindFirst("AccountID")?.Value;
            if (ModelState.IsValid)
            {
                return await _service.UpdateAsync(orderId,short.Parse(accId));
            }
            return 0;
        }

        // DELETE api/<OrderController>/5
        [HttpDelete("{orderId}")]
        [Authorize]
        public async Task<bool> Delete([FromRoute] short orderId)
        {
            var accId = User.FindFirst("AccountID")?.Value;
            if (ModelState.IsValid)
            {
                return await _service.DeleteAsync(orderId, short.Parse(accId));
            }
            return false;
        }

        [HttpGet("getMyOrderPending")]
        [Authorize]
        public async Task<IActionResult> GetMyOrderPending()
        {
            var accountId = User.FindFirst("AccountID")?.Value;
            var order = await _service.GetOrderPending(short.Parse(accountId));
            return Ok(new
            {
                exists = order != null,
                data = order
            });
        }
        [HttpPut("updateOrder/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateOrder([FromRoute] short orderId, [FromBody] OrderRequest request)
        {
            var accountId = User.FindFirst("AccountID")?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _service.UpdateOrderAsync(orderId, request, short.Parse(accountId));
            return Ok("Order successfully updated.");
        }
    }
}
