using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class FavouriteRequest
    {
        public short DinerId { get; set; }
        public short RestaurantId { get; set; }
    }
}
