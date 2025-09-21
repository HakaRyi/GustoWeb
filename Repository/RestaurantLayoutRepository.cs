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
        
    }
}
