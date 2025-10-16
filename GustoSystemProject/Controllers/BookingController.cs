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
        public BookingController(BookingService service)
        {
            this.service = service;
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
        }
        // POST api/<BookingController>
        [HttpPost("{restaurantId}")]
        public async Task<IActionResult> Post([FromRoute] CreateBookingRequest request)
        {
            var dinerId = User.FindFirst("AccountID")?.Value;
            request.DinerId = short.Parse(dinerId);
            var result = await service.Create(request);
            if (result == -1)
            {
                return Ok(new
                {
                    message = "booking is existed"
                });
            }
            if (result == 0)
            {
                return StatusCode(500, new
                {
                    message = "cant create booking, loi 500, hoac nha hang co the ko ton tai :V"
                });
            }
            return Ok(new
            {
                message = "Booking and Order successfully created",
                result = result   
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
