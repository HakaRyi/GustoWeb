using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.Request
{
    public class OrderDetailRequest
    {
        //public int ProductId { get; set; }
        //public int OrderId { get; set; }
        //public decimal UnitPrice { get; set; }
        [Required(ErrorMessage ="Quantity is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0.")]
        public int Quantity { get; set; }
    }
}
