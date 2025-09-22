using Microsoft.EntityFrameworkCore;
using Repository.DBContext;
using Repository.Models;

namespace Repository
{
    public class RestaurantTableRepository
    {
        private readonly GustoSystemContext context;
        public RestaurantTableRepository(GustoSystemContext context)
        {
            this.context = context;
        }
        public async Task<List<RestaurantTable>> GetAll()
        {
            return await context.RestaurantTables
                .Include(r => r.Account)
                .Include(r => r.Bookings)
                .Include(r => r.Orders)
                .ToListAsync();
        }
        public async Task<RestaurantTable> GetByIdAsync(int id)
        {
               
            return await context.RestaurantTables
                .Include(r => r.Account)
                .Include(r => r.Bookings)
                .Include(r => r.Orders)
                .FirstOrDefaultAsync(r => r.TableId == id);
        }
        public async Task<List<RestaurantTable>> GetByAccountAsync(int accountId)
        {
            return await context.RestaurantTables
                .Where(a => a.AccountId == accountId)
                .Include(r => r.Account)
                .Include(r => r.Bookings)
                .Include(r => r.Orders)
                .ToListAsync();
        }
        //-----------------------------------------------------
        public async Task<int> CreateAsync(RestaurantTable item)
        {
            context.RestaurantTables.Add(item);
            return await context.SaveChangesAsync();
        }
        public async Task<int> UpdateAsync(RestaurantTable item)
        {
            context.RestaurantTables.Update(item);
            return await context.SaveChangesAsync();
        }
        public async Task<int> DeleteAsync(int id)
        {
            var item = await GetByIdAsync(id);
            if (item != null)
            {
                context.RestaurantTables.Remove(item);
                return await context.SaveChangesAsync();
            }
            return 0;

        }

    }
}
