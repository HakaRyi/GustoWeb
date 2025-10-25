using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class PromotionRequest
    {
        public string Code { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int? DiscountPercent { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? MinOrderValue { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool? CreatedByAdmin { get; set; }
        public short? AccountId { get; set; }
    }
}
