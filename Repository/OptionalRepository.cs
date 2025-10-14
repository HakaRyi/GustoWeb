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
    public class OptionalRepository
    {
        private readonly GustoSystemContext context;
        public OptionalRepository(GustoSystemContext context) => this.context = context;

        public async Task<List<Optional>> GetAllAsync()
        {
            return await context.Optionals
                .Include(o => o.RestaurantMenu)
                .ToListAsync();
        }
        public async Task<Optional> GetByIdAsync(short id)
        {
            return await context.Optionals
                .Include(o => o.RestaurantMenu)
                .FirstOrDefaultAsync(pm => pm.Id == id);
        }
        public async Task<List<Optional>> GetOptByMenuAsync(short id)
        {
            return await context.Optionals
                .Where(pm => pm.RestaurantMenuId == id)
                .ToListAsync();
        }

        public async Task<int> CreateAsync(Optional opt)
        {
            context.Optionals.Add(opt);
            return await context.SaveChangesAsync();
        }
        public async Task<int> UpdateAsync(Optional opt)
        {
            context.Optionals.Update(opt);
            return await context.SaveChangesAsync();
        }
        public async Task<bool> DeleteAsync(short id)
        {
            var opt = await GetByIdAsync(id);
            if (opt != null)
            {
                context.Optionals.Remove(opt);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
