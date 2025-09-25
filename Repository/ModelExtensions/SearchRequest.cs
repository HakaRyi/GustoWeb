using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.ModelExtensions
{
    public class SearchRequest
    {
        public int? currentPage { get; set; }
        public int? pageSize { get; set; }

    }

    public class AccountSearchRequest : SearchRequest
    {
        public string? UserName { get; set; }
        public int? RoleId { get; set; }
        public string? ProfileName { get; set; }
    }
}
