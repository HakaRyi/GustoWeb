using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class AddOrderDetailRequest
    {
        //public short FoodId { get; set; }
        public List<short>? OptionalIds { get; set; } // optional toppings
        public List<short>? TasteIds { get; set; } // taste preferences
        public int Quantity { get; set; } = 1;
    }
}
