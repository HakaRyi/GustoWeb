using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Settings
{
    public class JwtSettings
    {
        public String SecretKey { get; set; }
        public int ExpiryMinutes { get; set; }
        public String Issuer { get; set; }
        public String Audience { get; set; }

    }
}
