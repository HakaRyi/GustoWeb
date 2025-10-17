using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class UpdateBookingRequest
    {
        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }
        public short? TableId { get; set; }
        public int? NumberOfPeople { get; set; }
        public decimal? DiscountAmount { get; set; }
        public string? Note {  get; set; }
        public short? PromotionId { get; set; }
    }
}
