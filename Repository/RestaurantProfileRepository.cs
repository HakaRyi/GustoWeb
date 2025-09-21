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
                .Include(r => r.Favourites)
                .Include(r => r.Orders)
                .ToListAsync();
        }
        public async Task<RestaurantProfile> GetByIdAsync(int id)
        {
            return await context.RestaurantProfiles
                .Include(r => r.RestaurantLayouts)
                .Include(r => r.RestaurantMenus)
                .Include(r => r.RestaurantTables)
                    .ThenInclude(t => t.Bookings) 
                .Include(r => r.RestaurantTables)
                    .ThenInclude(t => t.Orders)   
                .Include(r => r.Promotions)
                .Include(r => r.Bookings)
                    .ThenInclude(b => b.Table)    
                .Include(r => r.Orders)
                    .ThenInclude(o => o.Table)     
                .Include(r => r.Orders)
                    .ThenInclude(o => o.OrderDetails) 
                .Include(r => r.Favourites)
                .FirstOrDefaultAsync(r => r.AccountId == id);
        }
    }
}
