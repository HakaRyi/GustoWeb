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
    public class TasteRepository
    {
        private readonly GustoSystemContext context;
        public TasteRepository(GustoSystemContext context) => this.context = context;

        public async Task<List<Taste>> GetAllAsync()
        {
            return await context.Tastes
                .Include(t => t.RestaurantMenu)
                .ToListAsync();
        }
        public async Task<Taste> GetByIdAsync(short id)
        {
            return await context.Tastes
                .Include(t => t.RestaurantMenu).ThenInclude(t=>t.Account)
                .FirstOrDefaultAsync(pm => pm.Id == id);
        }
    
        public async Task<int> CreateAsync(Taste taste)
        {
            context.Tastes.Add(taste);
            return await context.SaveChangesAsync();
        }
        public async Task<int> UpdateAsync(Taste taste)
        {
            context.Tastes.Update(taste);
            return await context.SaveChangesAsync();
        }
        public async Task<bool> DeleteAsync(short id)
        {
            var taste = await GetByIdAsync(id);
            if (taste != null)
            {
                context.Tastes.Remove(taste);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
