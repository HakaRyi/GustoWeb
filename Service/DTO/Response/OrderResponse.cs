using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Response
{
    public class OrderResponse
    {
        public short? OrderId { get; set; }

        public short? PromotionId { get; set; }

        public DateTime Date { get; set; }

        public DateTime? PickTime { get; set; }

        public int? NumOfPeople { get; set; }

        public decimal? TotalPrice { get; set; }

        public decimal? DiscountAmount { get; set; }

        public decimal? FinalPrice { get; set; }

        public string Note { get; set; }

        public string Status { get; set; }

        public short? TableId { get; set; }

        public int? BookingId { get; set; }
        public List<OrderDetailResponse> OrderDetails { get; set; } = new List<OrderDetailResponse>();
    }
    public class OrderDetailResponse
    {
        public short OrderDetailId { get; set; }

        public string Food { get; set; }

        public int NumberOfFood { get; set; } //quantity @@

        public decimal? FoodPrice { get; set; }

        public string Img { get; set; }
        public decimal? TotalPrice => FoodPrice * NumberOfFood; 
    }
}
