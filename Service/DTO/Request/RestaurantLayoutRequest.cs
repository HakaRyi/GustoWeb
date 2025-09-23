using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class RestaurantLayoutRequest
    {

        public string Name { get; set; }

        public string LayoutUrl { get; set; }

        public string Description { get; set; }
    }
}
