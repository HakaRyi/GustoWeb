using Microsoft.EntityFrameworkCore;
using Repository.DBContext;
using Repository.Models;

namespace Repository
{
    public class RestaurantLayoutRepository
    {
        private readonly GustoSystemContext context;
        public RestaurantLayoutRepository(GustoSystemContext context)
        {
            this.context = context;
        }
        public async Task<List<RestaurantLayout>> GetAllAsync()
        {
            return await context.RestaurantLayouts
                .Include(r=>r.Account)
                .ToListAsync();
        }
        public async Task<RestaurantLayout> GetByIdAsync(int id)
        {
               
            return await context.RestaurantLayouts
                .Include(r=>r.Account)
                .FirstOrDefaultAsync(r => r.LayoutId == id);
        }
        public async Task<List<RestaurantLayout>> GetByAccountAsync(int accountId)
        {
            return await context.RestaurantLayouts
                .Where(a => a.AccountId == accountId)
                .Include(r => r.Account)
                .ToListAsync();
        }
        //-----------------------------------------------------
        public async Task<int> CreateAsync(RestaurantLayout item)
        {
            context.RestaurantLayouts.Add(item);
            return await context.SaveChangesAsync();
        }
        public async Task<int> UpdateAsync(RestaurantLayout item)
        {
            context.RestaurantLayouts.Update(item);
            return await context.SaveChangesAsync();
        }
        public async Task<int> DeleteAsync(int id)
        {
            var item = await GetByIdAsync(id);
            if (item != null)
            {
                context.RestaurantLayouts.Remove(item);
                return await context.SaveChangesAsync();
            }
            return 0;
            
        }
    }
}
