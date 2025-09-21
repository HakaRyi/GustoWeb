using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Response
{
    public class RestaurantMenuResponse
    {
        public short FoodId { get; set; }

        public string RestaurantName { get; set; }

        public string FoodName { get; set; }

        public decimal Price { get; set; }

        public decimal? OldPrice { get; set; }

        public int? DiscountPercent { get; set; }

        public DateTime? StartDiscount { get; set; }

        public DateTime? EndDiscount { get; set; }

        public bool? IsRecommended { get; set; }

        public bool? Status { get; set; }

        public string Type { get; set; }

        public string FoodImgUrl { get; set; }

        public string Description { get; set; }
    }
}
