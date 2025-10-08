using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Response
{
    public class DinerProfileResponse
    {
        public short AccountId { get; set; }
        public string AvatarUrl { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public int? Age { get; set; }
        public string Address { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Job { get; set; }
        public string Description { get; set; }
        public string FacebookUrl { get; set; }
        public string TiktokUrl { get; set; }
        public int? RewardPoints { get; set; }
    }
}
