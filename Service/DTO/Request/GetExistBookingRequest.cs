using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class GetExistBookingRequest
    {
        public short RestaurantId { get; set; }
        public List<short> TableId { get; set; }
    }
}
