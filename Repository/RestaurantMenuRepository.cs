using Microsoft.EntityFrameworkCore;
using Repository.DBContext;
using Repository.Models;

namespace Repository
{
    public class RestaurantMenuRepository
    {
        private readonly GustoSystemContext context;
        public RestaurantMenuRepository(GustoSystemContext context)
        {
            this.context = context;
        }
        public async Task<List<RestaurantMenu>> GetAll()
        {
            return await context.RestaurantMenus
                .Include(r => r.Account)
                .Include(r => r.FoodReviews)
                .Include(r => r.OrderDetails)
                .ToListAsync();
        }
        public async Task<List<RestaurantMenu>> GetByRestaurantId(int id)
        {
            return await context.RestaurantMenus
                .Where(r=>r.AccountId == id && r.Status == true)
                .ToListAsync();
        }
        public async Task<RestaurantMenu> GetByIdAsync(int id)
        {
               
            return await context.RestaurantMenus
                .Include(r => r.Optionals)
                .Include(r => r.FoodReviews)
                .Include(r => r.Tastes)
                .AsTracking()
                .FirstOrDefaultAsync(r => r.FoodId == id);
        }
        public async Task<List<RestaurantMenu>> GetByAccountAsync(int accountId)
        {
            return await context.RestaurantMenus
                .Where(a => a.AccountId == accountId)
                .Include(r => r.Account)
                .Include(r => r.FoodReviews)
                .Include(r => r.OrderDetails)
                .OrderByDescending(r => r.FoodId)
                .ToListAsync();
        }
        //-----------------------------------------------------
        public async Task<int> CreateAsync(RestaurantMenu item)
        {
            context.RestaurantMenus.Add(item);
            return await context.SaveChangesAsync();
        }
        public async Task<int> UpdateAsync(RestaurantMenu item)
        {
            context.RestaurantMenus.Update(item);
            return await context.SaveChangesAsync();
        }
        public async Task<int> DeleteAsync(int id)
        {
            var item = await GetByIdAsync(id);
            if (item != null)
            {
                context.RestaurantMenus.Remove(item);
                return await context.SaveChangesAsync();
            }
            return 0;

        }
    }
}
