using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Cms;
using Repository.Models;
using Service;
using Service.DTO.Request;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly BookingService service;
        private readonly OrderService orderService;
        public BookingController(BookingService service, OrderService orderService)
        {
            this.service = service;
            this.orderService = orderService;
        }
        // GET: api/<BookingController>
        [HttpGet]
        public async Task<List<Booking>> Get()
        {
            return await service.GetBookings();
        }

        // GET api/<BookingController>/5
        [HttpGet("{id}")]
        public async Task<Booking> Get([FromRoute]int id)
        {
            return await service.GetBooking(id);
        }
        [HttpGet("getBookingByMeAndRes/{resId}")]
        public async Task<Booking> GetBookingByMeAndResAsync([FromRoute] short resId)
        {
            var dinerId = User.FindFirst("AccountID")?.Value;
            return await service.GetBookingByMeAndResAsync(short.Parse(dinerId),resId);
        }

        [HttpGet("bookings")]
        public async Task<List<Booking>> GetBookingsByDate(short restaurantId, DateTime date)
        {
            try
            {
                return await service.GetBookingsByDate(restaurantId, date);
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
            return new List<Booking>();
        }

        [HttpGet("pending/{restaurantId}")]
        public async Task<IActionResult> GetPendingBooking(short restaurantId)
        {
            var dinerId = User.FindFirst("AccountID")?.Value;
            if (string.IsNullOrEmpty(dinerId))
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }
            var booking = await service.GetPendingBookingByDinerAndRestaurant(short.Parse(dinerId), restaurantId);
            if (booking == null)
            {
                return NotFound(new { message = "No pending booking found" });
            }
            var order = await orderService.GetMyOrderPending2(booking.DinerId);
            return Ok(new { bookingId = booking.BookingId, orderId = order?.OrderId });
        }
            // POST api/<BookingController>
            // POST api/Booking/{restaurantId}
            [HttpPost("{restaurantId}")]
            public async Task<IActionResult> Post([FromRoute] short restaurantId)
            {
                var dinerId = User.FindFirst("AccountID")?.Value;
                if (string.IsNullOrEmpty(dinerId))
                {
                    return Unauthorized(new { message = "Invalid or missing token" });
                }
                var result = await service.Create(short.Parse(dinerId), restaurantId);
                if (result == -1)
                {
                    var booking = await service.GetPendingBookingByDinerAndRestaurant(short.Parse(dinerId), restaurantId);
                    var _order = await orderService.GetMyOrderPending2(booking.DinerId);
                    return Ok(new
                    {
                        message = "booking is existed",
                        result = -1,
                        orderId = _order?.OrderId
                    });
                }
                if (result == 0)
                {
                    return StatusCode(500, new
                    {
                        message = "Cannot create booking. Restaurant may not exist or server error occurred."
                    });
                }
                var newBooking = await service.GetLatestBookingByDiner(short.Parse(dinerId));
                var order = await orderService.GetMyOrderPending2(newBooking.DinerId);
                return Ok(new
                {
                    message = "Booking and Order successfully created",
                    result = 1,
                    orderId = order?.OrderId
                });
            }

            // PUT api/<BookingController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put([FromRoute]short id)
        {
            var dinerId = User.FindFirst("AccountID")?.Value;
            var result = await service.Update(id,short.Parse(dinerId));
  
            if (result == 0)
            {
                return StatusCode(500, new
                {
                    message = "cant update booking, loi 500:V"
                }); 
            }
            return Ok(new
            {
                message = "Booking successfully updated",
                result = result
            });
        }

        // DELETE api/<BookingController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
