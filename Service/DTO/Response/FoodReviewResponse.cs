using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Response
{
    public class FoodReviewResponse
    {
        public short? ReviewId { get; set; }
        public short? FoodId { get; set; }
        public string FoodName { get; set; }
        public short? DinerId { get; set; }
        public string DinerName { get; set; }
        public DateTime Date { get; set; }
        public int Rating { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public bool IsAnonymous { get; set; }
    }
}
