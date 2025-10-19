using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request.AccountRequest
{
    public class ResetPasswordRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
    }
}
