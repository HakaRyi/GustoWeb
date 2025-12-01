using Repository;
using Service.DTO.Response;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service
{
    public class DashboardService
    {
        private readonly DashboardRepository _repository;

        public DashboardService(DashboardRepository repository)
        {
            _repository = repository;
        }

        public async Task<AdminDashboardResponse> GetAdminDashboardAsync()
        {
            var response = new AdminDashboardResponse();

            try
            {
                // 1. Số liệu tổng quan (Giữ nguyên)
                response.TotalFoods = await _repository.CountFoodsAsync();
                response.TotalRestaurants = await _repository.CountRestaurantsAsync();
                response.PendingOrders = await _repository.CountPendingOrdersAsync();
                response.TodayReviews = await _repository.CountTodayReviewsAsync();

                // 👇👇 2. SỬA ĐOẠN NÀY: BIỂU ĐỒ DOANH THU THEO 12 THÁNG 👇👇
                var revenueMap = await _repository.GetMonthlyRevenueThisYearAsync();
                response.RevenueChart = new List<RevenueChartData>();

                // Loop từ tháng 1 đến tháng 12
                for (int i = 1; i <= 12; i++)
                {
                    response.RevenueChart.Add(new RevenueChartData
                    {
                        Name = $"T{i}", // Tên hiển thị: T1, T2, T3... (cho gọn)
                        Total = revenueMap.ContainsKey(i) ? revenueMap[i] : 0
                    });
                }
                // 👆👆 KẾT THÚC SỬA 👆👆

                // 3. Top món ăn (Giữ nguyên)
                response.TopSellingFoods = await _repository.GetTopSellingFoodsAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("DASHBOARD ERROR: " + ex.ToString());
                throw;
            }

            return response;
        }
    }
}