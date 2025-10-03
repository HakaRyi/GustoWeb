using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class SendEmailRequest
    {
        public string ReceiverName { get; set; }
        public string ReceiverMail { get; set; }
        public string Subject { get; set; }
        public string Messenger { get; set; }
    }
}
