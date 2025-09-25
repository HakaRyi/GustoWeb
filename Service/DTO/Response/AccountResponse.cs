using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Response
{
    public class AccountResponse
    {
        public short Id { get; set; }
        public string UserName { get; set; }

        public int RoleId { get; set; }
    }
}
