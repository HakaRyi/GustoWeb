using Microsoft.EntityFrameworkCore;
using Repository.DBContext;
using Repository.Models;

namespace Repository
{
    public class FavouriteRepository
    {
        private readonly GustoSystemContext _context;

        public FavouriteRepository(GustoSystemContext context)
        {
            _context = context;
        }

        public async Task<List<Favourite>> GetByDinerIdAsync(short dinerId)
        {
            return await _context.Favourites
                .Include(f => f.Restaurant)
                .Where(f => f.DinerId == dinerId)
                .ToListAsync();
        }

        public async Task<Favourite?> GetByIdAsync(short id)
        {
            return await _context.Favourites
                .Include(f => f.Restaurant)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task AddAsync(Favourite favourite)
        {
            _context.Favourites.Add(favourite);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Favourite favourite)
        {
            var existing = await _context.Favourites.FindAsync(favourite.Id);
            if (existing != null)
            {
                existing.DinerId = favourite.DinerId;
                existing.RestaurantId = favourite.RestaurantId;
                existing.CreatedAt = favourite.CreatedAt;

                _context.Favourites.Update(existing);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(short id)
        {
            var fav = await _context.Favourites.FindAsync(id);
            if (fav != null)
            {
                _context.Favourites.Remove(fav);
                await _context.SaveChangesAsync();
            }
        }
    }
}
