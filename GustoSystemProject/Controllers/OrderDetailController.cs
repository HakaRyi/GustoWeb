using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly OrderDetailService service;
        public OrderDetailController(OrderDetailService service)
        {
            this.service = service;
        }
        // GET: api/<OrderDetailController>
        [HttpGet]
        public async Task<List<OrderDetail>> Get()
        {
            return await service.GetAllDetails();
        }

        // GET api/<OrderDetailController>/5
        [HttpGet("{id}")]
        public async Task<OrderDetail> GetID(short id)
        {
            return await service.GetByIdAsync(id);
        }

        // POST api/<OrderDetailController>
        [HttpPost("{foodId}/{orderId}")]
        public async Task<IActionResult> Post ([FromRoute]short foodId,short orderId)
        {
            if (ModelState.IsValid)
            {
                await service.AddOrderDetailAsync(orderId, foodId);
            }
            return Ok(new
            {
                message = "add thanh cong",
             
            });

        }

        // PUT api/<OrderDetailController>/5
        [HttpPut("{id}")]
        public async Task<int> Put(short id, [FromBody] string value)
        {
            var dinnerId = User.FindFirst("AccountID")?.Value;
            if (ModelState.IsValid)
            {
                return await service.UpdateAsync(id, short.Parse(dinnerId));
            }
            return 0;
        }

        // DELETE api/<OrderDetailController>/5
        [HttpDelete("{id}")]
        public async Task<bool> Delete([FromRoute]short id)
        {
            var dinnerId = User.FindFirst("AccountID")?.Value;
            return await service.DeleteAsync(id,short.Parse(dinnerId));
        }

        [HttpDelete("deleteOrderDetail/{orderDetailid}")]
        [Authorize]
        public async Task<IActionResult> DeleteOrderDetail([FromRoute] short orderDetailid)
        {
            var userId = User.FindFirst("AccountID")?.Value;
            var orderDetail = await service.GetByIdAsync(orderDetailid);
            if (orderDetail == null)
            {
                return NotFound($"Order detail with ID {orderDetailid} not found.");
            }
            if (int.Parse(userId) != orderDetail.Order.Booking.DinerId)
            {
                throw new UnauthorizedAccessException("This user do not have this permission.");
            }

            await service.DeleteAsync(orderDetailid,short.Parse(userId));
            return Ok("Order detail successfully deleted.");
        }
    }
}
