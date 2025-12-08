using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTO.Response
{
    public class AdminDashboardResponse
    {
        public int TotalFoods { get; set; }
        public int TotalRestaurants { get; set; }
        public int PendingOrders { get; set; }
        public int TodayReviews { get; set; }

        public List<RevenueChartData> RevenueChart { get; set; }

       
        public List<TopFoodData> TopSellingFoods { get; set; }
    }

    public class RevenueChartData
    {
        public string Name { get; set; }
        public decimal Total { get; set; }
    }

  
}
