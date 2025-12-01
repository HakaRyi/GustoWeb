using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.DTO.Request;

namespace GustoSystemProject.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminBookingController : ControllerBase
    {
        private readonly BookingService _service;

        public AdminBookingController(BookingService service)
        {
            _service = service;
        }

        // 1. Lấy danh sách Booking
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllBookingsForAdmin();
            return Ok(result);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateBooking(int id, [FromBody] AdminUpdateBookingRequest request)
        {
            var success = await _service.AdminUpdateBookingAsync(id, request);
            if (!success) return NotFound("Booking not found");
            return Ok(new { message = "Booking updated successfully" });
        }

        // 2. Hủy Booking
        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var success = await _service.AdminCancelBooking(id);
            if (!success) return NotFound("Booking not found");
            return Ok(new { message = "Booking cancelled successfully" });
        }

        
    }
}
