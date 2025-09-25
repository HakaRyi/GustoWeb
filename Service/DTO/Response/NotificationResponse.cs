using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Response
{
    public class NotificationResponse
    {
        public string Title { get; set; }

        public string Message { get; set; }

        public bool? IsRead { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
