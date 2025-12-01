using Microsoft.EntityFrameworkCore;
using Repository.DBContext;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repository
{
    public class DashboardRepository
    {
        private readonly GustoSystemContext _context;

        public DashboardRepository(GustoSystemContext context)
        {
            _context = context;
        }

        // 1. Đếm số lượng
        public async Task<int> CountFoodsAsync() => await _context.RestaurantMenus.CountAsync();
        public async Task<int> CountRestaurantsAsync() => await _context.RestaurantProfiles.CountAsync();
        // Lưu ý: Kiểm tra xem DB của bạn Status là "Pending" hay "pending" (chữ hoa/thường)
        public async Task<int> CountPendingOrdersAsync() => await _context.Orders.CountAsync(o => o.Status.ToLower() == "pending");

        public async Task<int> CountTodayReviewsAsync()
        {
            var today = DateTime.Today;
            return await _context.FoodReviews.CountAsync(r => r.Date.Date == today);
        }

        // 2. Tính doanh thu 7 ngày qua
        public async Task<Dictionary<int, decimal>> GetMonthlyRevenueThisYearAsync()
        {
            var currentYear = DateTime.Now.Year;

            // 1. Lấy dữ liệu thô của năm nay (Đã thanh toán)
            var rawData = await _context.Orders
                .Where(o => o.Date.Year == currentYear && (o.Status == "Paid" || o.Status == "paid"))
                .Select(o => new { o.Date.Month, o.FinalPrice })
                .ToListAsync();

            // 2. Group theo Tháng (1 -> 12)
            var result = rawData
                .GroupBy(o => o.Month)
                .ToDictionary(
                    g => g.Key, // Key là số tháng (1, 2, 3...)
                    g => g.Sum(x => x.FinalPrice ?? 0)
                );

            return result;
        }

        // 3. Top 5 món ăn bán chạy nhất (Code an toàn hơn)
        public async Task<List<TopFoodData>> GetTopSellingFoodsAsync()
        {
            // B1: Lấy thống kê số lượng bán từ OrderDetails
            var topStats = await _context.OrderDetails
                .GroupBy(od => od.FoodId)
                .Select(g => new
                {
                    FoodId = g.Key,
                    TotalSold = g.Sum(od => od.NumberOfFood)
                })
                .OrderByDescending(x => x.TotalSold)
                .Take(5)
                .ToListAsync();

            if (!topStats.Any()) return new List<TopFoodData>();

            // B2: Lấy thông tin chi tiết món ăn (Tên, Nhà hàng)
            var foodIds = topStats.Select(x => x.FoodId).ToList();

            var menuInfos = await _context.RestaurantMenus
                .Include(m => m.Account) // Join sang RestaurantProfile
                .Where(m => foodIds.Contains(m.FoodId))
                .Select(m => new
                {
                    m.FoodId,
                    FoodName = m.Name,
                    RestaurantName = m.Account.FullName ?? "Unknown"
                })
                .ToListAsync();

            // B3: Ghép dữ liệu (Mapping)
            var result = new List<TopFoodData>();
            foreach (var stat in topStats)
            {
                var info = menuInfos.FirstOrDefault(m => m.FoodId == stat.FoodId);
                result.Add(new TopFoodData
                {
                    FoodName = info?.FoodName ?? $"Food #{stat.FoodId}",
                    RestaurantName = info?.RestaurantName ?? "Unknown",
                    SoldCount = stat.TotalSold
                });
            }

            return result;
        }
    }
}