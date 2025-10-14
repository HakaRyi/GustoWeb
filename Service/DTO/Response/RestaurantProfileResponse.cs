using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Response
{
    public class RestaurantProfileResponse
    {
        public short AccountId { get; set; }

        public string AvatarUrl { get; set; }

        public string FullName { get; set; }

        public string Phone { get; set; }

        public string? Address { get; set; }

        public string Email { get; set; }

        public TimeOnly? OpenAt { get; set; }
        public TimeOnly? CloseAt { get; set; }

        public string? Description { get; set; }

        public string? FacebookUrl { get; set; }

        public string? TiktokUrl { get; set; }
        public int Rating { get; set; }

        public virtual PaymentMerchant paymentMerchant { get; set; }
    }
}
