using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Response
{
    public class RestaurantLayoutResponse
    {
        public short LayoutId { get; set; }

        public string RestaurantName { get; set; }

        public string Name { get; set; }

        public string LayoutImgUrl { get; set; }

        public string Description { get; set; }
    }
}
