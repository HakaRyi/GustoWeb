using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Request
{
    public class RestaurantProfileRequest
    {
        public int? Id { get; set; }
        public string? AvatarUrl { get; set; }

        public string? FullName { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }

        public string? Email { get; set; }

        public TimeOnly? OpenAt { get; set; }
        public TimeOnly? CloseAt { get; set; }

        public string? Description { get; set; }

        public string? FacebookUrl { get; set; }
        public DateTime CreateAt { get; set; }
        public int? Duration { get; set; }

        public string? TiktokUrl { get; set; }
    }
}
