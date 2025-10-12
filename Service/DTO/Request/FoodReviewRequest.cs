using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class FoodReviewRequest
    {
        public short FoodId { get; set; }
        public short DinerId { get; set; }
        public int Rating { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public bool IsAnonymous { get; set; }
        public short OrderId { get; set; }
    }

    public class FeedbackRequest
    {
        public List<FoodReviewRequest> Feedbacks { get; set; }
    }

}
