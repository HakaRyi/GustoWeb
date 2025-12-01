using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class AdminUpdateBookingRequest
    {
        public DateTime BookingTime { get; set; }
        public string Status { get; set; } 
        public short? TableId { get; set; } 
    }
}
