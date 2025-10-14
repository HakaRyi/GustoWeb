using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class AddPaymentMerchantRequest
    {

        public string BankNo { get; set; }

        public string BankAccountName { get; set; }

        public string Bank { get; set; }

        public short AccountId { get; set; }

    }
}
