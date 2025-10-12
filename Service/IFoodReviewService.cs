using Repository.Models;
using Repository;
using Service.DTO.Request;
using Service.DTO.Response;

namespace Service
{
    public class FoodReviewService
    {
        private readonly FoodReviewRepository _repository;

        public FoodReviewService(FoodReviewRepository repository)
        {
            _repository = repository;
        }

        public async Task AddAsync(FeedbackRequest request)
        {
            var feedbacks = request.Feedbacks.Select(f => new FoodReview
            {
                DinerId = f.DinerId,
                FoodId = f.FoodId,
                Rating = f.Rating,
                Description = f.Description,
                IsAnonymous = f.IsAnonymous,
                Date = DateTime.Now,
                ImageUrl = f.ImageUrl,
                OrderId = f.OrderId,
            }).ToList();

            await _repository.AddAsync(feedbacks);
        }

        public async Task<List<FoodReviewResponse>> GetByFoodIdAsync(short foodId)
        {
            var reviews = await _repository.GetByFoodIdAsync(foodId);
            return reviews.Select(r => new FoodReviewResponse
            {
                ReviewId = r.ReviewId,
                FoodId = r.FoodId,
                DinerId = r.DinerId,
                Rating = r.Rating ?? 0,
                Description = r.Description,
                ImageUrl = r.ImageUrl,
                IsAnonymous = r.IsAnonymous ?? false,
                Date = r.Date,
                DinerName = r.Diner?.FullName,
                FoodName = r.Food?.Name
            }).ToList();
        }

        public async Task<List<FoodReviewResponse>> GetByDinerIdAsync(short dinerId)
        {
            var reviews = await _repository.GetByDinerIdAsync(dinerId);
            return reviews.Select(r => new FoodReviewResponse
            {
                ReviewId = r.ReviewId,
                FoodId = r.FoodId,
                DinerId = r.DinerId,
                Rating = r.Rating ?? 0,
                Description = r.Description,
                ImageUrl = r.ImageUrl,
                IsAnonymous = r.IsAnonymous ?? false,
                Date = r.Date,
                DinerName = r.Diner?.FullName,
                FoodName = r.Food?.Name
            }).ToList();
        }

        public async Task UpdateFeedbacksAsync(FeedbackRequest request)
        {
            var feedbacks = request.Feedbacks.Select(f => new FoodReview
            {
                DinerId = f.DinerId,
                FoodId = f.FoodId,
                Rating = f.Rating,
                Description = f.Description,
                IsAnonymous = f.IsAnonymous,
                Date = DateTime.Now,
                ImageUrl= f.ImageUrl,
                OrderId = f.OrderId,
            }).ToList();

            await _repository.UpdateFeedbacksAsync(feedbacks);
        }

        public async Task<bool> DeleteAsync(short reviewId, short dinerId)
        {
            return await _repository.DeleteAsync(reviewId, dinerId);
        }
    }
}
