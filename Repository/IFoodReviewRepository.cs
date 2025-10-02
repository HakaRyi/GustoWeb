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
    public class FoodReviewRepository
    {
        private readonly GustoSystemContext _context;

        public FoodReviewRepository(GustoSystemContext context)
        {
            _context = context;
        }

        public async Task<FoodReview> AddAsync(FoodReview review)
        {
            _context.FoodReviews.Add(review);
            await _context.SaveChangesAsync();
            return review;
        }

        public async Task<List<FoodReview>> GetByFoodIdAsync(short foodId)
        {
            return await _context.FoodReviews
                .Include(r => r.Diner)
                .Include(r => r.Food)
                .Where(r => r.FoodId == foodId)
                .ToListAsync();
        }

        public async Task<List<FoodReview>> GetByDinerIdAsync(short dinerId)
        {
            return await _context.FoodReviews
                .Include(r => r.Food)
                .Include(r => r.Diner)
                .Where(r => r.DinerId == dinerId)
                .ToListAsync();
        }

        public async Task<FoodReview?> GetByIdAsync(short reviewId)
        {
            return await _context.FoodReviews
                .Include(r => r.Diner)
                .Include(r => r.Food)
                .FirstOrDefaultAsync(r => r.ReviewId == reviewId);
        }

        public async Task<FoodReview?> UpdateAsync(FoodReview review)
        {
            var existing = await _context.FoodReviews.FindAsync(review.ReviewId);
            if (existing == null) return null;

            existing.Rating = review.Rating;
            existing.Description = review.Description;
            existing.ImageUrl = review.ImageUrl;
            existing.IsAnonymous = review.IsAnonymous;
            existing.Date = DateTime.Now;

            _context.FoodReviews.Update(existing);
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(short reviewId, short dinerId)
        {
            var review = await _context.FoodReviews
                .FirstOrDefaultAsync(r => r.ReviewId == reviewId && r.DinerId == dinerId);
            if (review == null) return false;

            _context.FoodReviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

