using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class CreateBookingRequest
    {
        public short RestaurantId { get; set; }
        public short DinerId { get; set; }
        public DateTime BookingDate { get; set; }
    }
}
