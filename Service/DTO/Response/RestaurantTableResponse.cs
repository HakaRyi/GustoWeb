using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Response
{
    public class RestaurantTableResponse
    {
        public short TableId { get; set; }

        public string RestaurantName { get; set; }

        public string Name { get; set; }

        public int PersonNumber { get; set; }

        public string Position { get; set; }

        public string Description { get; set; }

        public string Status { get; set; }

        public bool? IsVip { get; set; }

        public decimal? MinCharge { get; set; }

        public decimal? Deposit { get; set; }
    }
}
