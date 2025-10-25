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
    public class PromotionRepository
    {
        private readonly GustoSystemContext _context;

        public PromotionRepository(GustoSystemContext context)
        {
            _context = context;
        }

        public async Task<List<Promotion>> GetAllAsync()
        {
            return await _context.Promotions
                .Include(p => p.Account)
                .ToListAsync();
        }

        public async Task<List<Promotion>> GetByAccountIdAsync(short accountId)
        {
            return await _context.Promotions
                .Include(p => p.Account)
                .Where(p => p.AccountId == accountId)
                .ToListAsync();
        }

        public async Task<Promotion?> GetByIdAsync(short id)
        {
            return await _context.Promotions
                .Include(p => p.Account)
                .FirstOrDefaultAsync(p => p.PromotionId == id);
        }

        public async Task<Promotion?> GetByCodeAsync(string code)
        {
            if (string.IsNullOrWhiteSpace(code)) return null;

            return await _context.Promotions
                .Include(p => p.Account)
                .FirstOrDefaultAsync(p => p.Code == code);
        }

        public async Task AddAsync(Promotion promotion)
        {
            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Promotion promotion)
        {
            var existing = await _context.Promotions.FindAsync(promotion.PromotionId);
            if (existing != null)
            {
                existing.Code = promotion.Code;
                existing.Description = promotion.Description;
                existing.DiscountPercent = promotion.DiscountPercent;
                existing.DiscountAmount = promotion.DiscountAmount;
                existing.MinOrderValue = promotion.MinOrderValue;
                existing.StartDate = promotion.StartDate;
                existing.EndDate = promotion.EndDate;
                existing.CreatedByAdmin = promotion.CreatedByAdmin;
                existing.AccountId = promotion.AccountId;

                _context.Promotions.Update(existing);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(short id)
        {
            var promo = await _context.Promotions.FirstOrDefaultAsync(p => p.PromotionId == id);
            if (promo != null)
            {
                _context.Promotions.Remove(promo);
                await _context.SaveChangesAsync();
            }
        }
    }
}

