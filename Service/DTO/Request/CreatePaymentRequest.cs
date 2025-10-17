using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class CreatePaymentRequest
    {
        public short OrderId { get; set; }
        public decimal Amount { get; set; }
        public string ReturnUrl { get; set; }
    }
}
