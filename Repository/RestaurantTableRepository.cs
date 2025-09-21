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
                .ToListAsync();
        }
        public async Task<RestaurantTable> GetByIdAsync(int id)
        {
               
            return await context.RestaurantTables
                .FirstOrDefaultAsync(r => r.TableId == id);
        }
        
    }
}
