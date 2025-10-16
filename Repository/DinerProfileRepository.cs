using Microsoft.EntityFrameworkCore;
using Repository.DBContext;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class DinerProfileRepository
    {
        private readonly GustoSystemContext _context;

        public DinerProfileRepository(GustoSystemContext context)
        {
            _context = context;
        }

        public async Task<List<DinerProfile>> GetAllAsync()
        {
            return await _context.DinerProfiles
                .Include(x => x.Bookings)
                    .ThenInclude(x => x.Restaurant)
                        .ThenInclude(r => r.RestaurantTables)
                .Include(x => x.Bookings)
                    .ThenInclude(x => x.Restaurant)
                        .ThenInclude(r => r.RestaurantLayouts)
                .Include(x => x.Bookings)
                    .ThenInclude(x => x.Restaurant)
                        .ThenInclude(r => r.RestaurantMenus)
                .Include(x => x.Bookings)
                    .ThenInclude(x => x.Orders)
                        .ThenInclude(x => x.OrderDetails)
                .Include(x => x.Bookings)
                    .ThenInclude(x => x.Orders)
                        .ThenInclude(x => x.FoodReviews)
                .Include(x => x.Account)
                .ToListAsync();
        }

        public async Task<DinerProfile?> GetByIdAsync(short id)
        {
            return await _context.DinerProfiles
                .Include(x => x.Bookings)
                    .ThenInclude(x => x.Restaurant)
                        .ThenInclude(r => r.RestaurantTables)
                .Include(x => x.Bookings)
                    .ThenInclude(x => x.Restaurant)
                        .ThenInclude(r => r.RestaurantLayouts)
                .Include(x => x.Bookings)
                    .ThenInclude(x => x.Restaurant)
                        .ThenInclude(r => r.RestaurantMenus)
                 .Include(x => x.Bookings)
                    .ThenInclude(x => x.Orders)
                        .ThenInclude(x => x.OrderDetails)
                            .ThenInclude(x => x.Food)
                .Include(x => x.Bookings)
                    .ThenInclude(x => x.Orders)
                        .ThenInclude(x => x.FoodReviews)
                .Include(x => x.Account)
                .FirstOrDefaultAsync(x => x.AccountId == id);
        }

        public async Task AddAsync(DinerProfile entity)
        {
            await _context.DinerProfiles.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(DinerProfile entity)
        {
            _context.DinerProfiles.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(short id)
        {
            var entity = await _context.DinerProfiles.FindAsync(id);
            if (entity != null)
            {
                _context.DinerProfiles.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
