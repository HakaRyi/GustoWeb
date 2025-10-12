using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Repository.DBContext;
using Repository.Models;

namespace Repository
{
    public class RestaurantProfileRepository
    {
        private readonly GustoSystemContext context;
        
        public RestaurantProfileRepository(GustoSystemContext context)
        {
            this.context = context;
        }
        public async Task<List<RestaurantProfile>> GetAllAsync()
        {
            return await context.RestaurantProfiles
                .Include(r => r.RestaurantLayouts)
                .Include(r=>r.RestaurantMenus)
                .Include(r=>r.RestaurantTables)
                .Include(r=>r.Promotions)
                .Include(r => r.Bookings)
                    .ThenInclude(r=>r.Orders)
                    .ThenInclude(r=>r.Table)
                .Include(r => r.Favourites)
                .ToListAsync();
        }
        public async Task<RestaurantProfile> GetByIdAsync(int id)
        {
            return await context.RestaurantProfiles
                .Include(r=>r.Account)
                .Include(r => r.RestaurantLayouts)
                .Include(r => r.RestaurantMenus)
                .Include(r => r.RestaurantTables)
                    .ThenInclude(t => t.Bookings) 
                .Include(r => r.RestaurantTables)
                    .ThenInclude(t => t.Orders)   
                .Include(r => r.Promotions)
                .Include(r => r.Bookings)
                    .ThenInclude(b => b.Table) 
                    .ThenInclude(b => b.Orders)
                .Include(r => r.Favourites)
                .FirstOrDefaultAsync(r => r.AccountId == id);
        }
        public async Task<List<RestaurantProfile>> GetByAccountAsync(int accountId)
        {
            return await context.RestaurantProfiles
                .Where(a => a.AccountId == accountId)
                .Include(r => r.RestaurantLayouts)
                .Include(r => r.RestaurantMenus)
                .Include(r => r.RestaurantTables)
                    .ThenInclude(t => t.Bookings)
                .Include(r => r.RestaurantTables)
                    .ThenInclude(t => t.Orders)
                .Include(r => r.Promotions)
                .Include(r => r.Bookings)
                    .ThenInclude(b => b.Table)
                    .ThenInclude(b => b.Orders)
                .Include(r => r.Favourites)
                .ToListAsync();
        }
        //-----------------------------------------------------
        public async Task<int> CreateAsync(RestaurantProfile item)
        {
            context.RestaurantProfiles.Add(item);
            return await context.SaveChangesAsync();
        }
        public async Task<int> UpdateAsync(RestaurantProfile item)
        {
            context.RestaurantProfiles.Update(item);
            return await context.SaveChangesAsync();
        }
        public async Task<int> DeleteAsync(int id)
        {
            var item = await GetByIdAsync(id);
            if (item != null)
            {
                context.RestaurantProfiles.Remove(item);
                return await context.SaveChangesAsync();
            }
            return 0;

        }
    }
}
