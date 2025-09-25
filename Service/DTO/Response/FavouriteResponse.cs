using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Response
{
    public class FavouriteResponse
    {
        public short Id { get; set; }
        public short DinerId { get; set; }
        public short RestaurantId { get; set; }
        public DateTime? CreatedAt { get; set; }

        public string? RestaurantName { get; set; }
    }
}
