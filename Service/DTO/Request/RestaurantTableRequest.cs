using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class RestaurantTableRequest
    {

        public string Name { get; set; }

        public int PersonNumber { get; set; }

        public string Position { get; set; }

        public string Description { get; set; }

        public Status Status { get ; set; }

        public bool? IsVip { get; set; }

        public decimal? MinCharge { get; set; }

        public decimal? Deposit { get; set; }
    }
    public enum Status
    {
        Available = 0,    // Bàn trống, có thể nhận khách
        Reserved = 1,     // Bàn đã được đặt trước
        Occupied = 2,     // Bàn đang có khách ngồi
        Cleaning = 3,     // Bàn đang dọn dẹp, chưa thể nhận khách
        Unavailable = 4   // Bàn hỏng, không sử dụng được
    }
}
