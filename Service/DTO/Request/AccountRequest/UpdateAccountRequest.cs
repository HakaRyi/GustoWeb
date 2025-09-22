using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request.AccountRequest
{
    public class UpdateAccountRequest
    {
        public short Id { get; set; }

        public string UserName { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
    }
}
