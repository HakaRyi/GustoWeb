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

        public async Task AddAsync(List<FoodReview> review)
        {
            _context.FoodReviews.AddRangeAsync(review);
            await _context.SaveChangesAsync();
        }

        public async Task<List<FoodReview>> GetByFoodIdAsync(short foodId)
        {
            return await _context.FoodReviews
                .Include(r => r.Diner)
                .Include(r => r.Food).ThenInclude(r=>r.Account)
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

        public async Task UpdateFeedbacksAsync(List<FoodReview> feedbacks)
        {
            foreach (var feedback in feedbacks)
            {
                var existing = await _context.FoodReviews
                    .FirstOrDefaultAsync(f => f.FoodId == feedback.FoodId && f.DinerId == feedback.DinerId && f.OrderId == feedback.OrderId);
                Console.WriteLine(_context.ChangeTracker.AutoDetectChangesEnabled);

                if (existing != null)
                {
                    existing.Rating = feedback.Rating;
                    existing.Description = feedback.Description;
                    existing.IsAnonymous = feedback.IsAnonymous;
                    existing.Date = DateTime.Now;
                    _context.FoodReviews.Update(existing);
                }
            }
            await _context.SaveChangesAsync();
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
        public async Task<double> GetAverageRatingByRestaurantIdAsync(int restaurantId)
        {
            var ratings = await _context.FoodReviews
                .Where(r => r.Food.AccountId == restaurantId && r.Rating.HasValue)
                .Select(r => r.Rating.Value)
                .ToListAsync();

            if (ratings == null || ratings.Count == 0)
                return 0; 

         
            return Math.Round(ratings.Average(), 1);
        }
    }
}

