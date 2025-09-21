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
        
    }
}
