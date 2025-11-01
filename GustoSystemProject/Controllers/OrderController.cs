using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Service;
using Service.DTO.Request;
using Service.DTOs.Request;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _service;
        private readonly PayOsPaymentService _payOsPaymentService;
        public OrderController(OrderService service, PayOsPaymentService payOsPaymentService)
        {
            _service = service;
            _payOsPaymentService = payOsPaymentService;
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

        [HttpGet("getMyOrderPending/{restaurantId}")]
        [Authorize]
        public async Task<IActionResult> GetMyOrderPending([FromRoute] short restaurantId)
        {
            var accountId = User.FindFirst("AccountID")?.Value;
            var order = await _service.GetMyOrderPending(short.Parse(accountId), restaurantId);
            return Ok(new
            {
                exists = order != null,
                data = order
            });
        }
        [HttpPut("updateOrder/{orderId}")]
        [Authorize]
        public async Task<IActionResult> UpdateOrder([FromRoute] short orderId, [FromBody] UpdateBookingRequest request)
        {
            try
            {
                var accountId = User.FindFirst("AccountID")?.Value;
                if (string.IsNullOrEmpty(accountId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        message = "Invalid request data",
                        errors = ModelState.Values.SelectMany(v => v.Errors)
                    });
                }

                await _service.UpdateOrderAsync(orderId, request, short.Parse(accountId));

                return Ok(new
                {
                    message = "Order successfully updated",
                    orderId = orderId
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating order {orderId}: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return StatusCode(500, new
                {
                    message = "An error occurred while updating the order",
                    detail = ex.Message
                });
            }
        }
        [HttpPost("pay/{orderId}")]
        public async Task<IActionResult> Pay(short orderId)
        {
            try
            {
                var order = await _service.GetOrderAsync(orderId); 
                if (order == null) return NotFound("Order not found");
                var returnUrl = "https://www.gustoweb.site/profile/bkh";
                order.FinalPrice = (order.FinalPrice ?? 0);

                var amount = (decimal)(order.FinalPrice ?? 0);
                if (amount < 1000) amount = 3000;

         
                var link = await _payOsPaymentService.CreatePaymentUrlAsync(orderId, amount, returnUrl);
                return Ok(new { checkoutUrl = link });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
