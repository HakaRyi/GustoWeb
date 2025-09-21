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
                .ToListAsync();
        }
        public async Task<RestaurantMenu> GetByIdAsync(int id)
        {
               
            return await context.RestaurantMenus
            
                .FirstOrDefaultAsync(r => r.FoodId == id);
        }
        
    }
}
