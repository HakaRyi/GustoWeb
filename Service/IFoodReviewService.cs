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

        public async Task<FoodReviewResponse> AddAsync(FoodReviewRequest request)
        {
            var review = new FoodReview
            {
                FoodId = request.FoodId,
                DinerId = request.DinerId,
                Rating = request.Rating,
                Description = request.Description,
                ImageUrl = request.ImageUrl,
                IsAnonymous = request.IsAnonymous,
                Date = DateTime.Now
            };

            var created = await _repository.AddAsync(review);

            return new FoodReviewResponse
            {
                ReviewId = created.ReviewId,
                FoodId = created.FoodId,
                DinerId = created.DinerId,
                Rating = created.Rating ?? 0,
                Description = created.Description,
                ImageUrl = created.ImageUrl,
                IsAnonymous = created.IsAnonymous ?? false,
                Date = created.Date
            };
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

        public async Task<FoodReviewResponse?> UpdateAsync(short reviewId, FoodReviewRequest request)
        {
            var review = new FoodReview
            {
                ReviewId = reviewId,
                FoodId = request.FoodId,
                DinerId = request.DinerId,
                Rating = request.Rating,
                Description = request.Description,
                ImageUrl = request.ImageUrl,
                IsAnonymous = request.IsAnonymous
                // ❌ Không set Date = DateTime.Now ở đây,
                // repo nên giữ lại Date gốc (ngày tạo).
            };

            var updated = await _repository.UpdateAsync(review);
            if (updated == null) return null;

            return new FoodReviewResponse
            {
                ReviewId = updated.ReviewId,
                FoodId = updated.FoodId,
                DinerId = updated.DinerId,
                Rating = updated.Rating ?? 0,
                Description = updated.Description,
                ImageUrl = updated.ImageUrl,
                IsAnonymous = updated.IsAnonymous ?? false,
                Date = updated.Date
            };
        }

        public async Task<bool> DeleteAsync(short reviewId, short dinerId)
        {
            return await _repository.DeleteAsync(reviewId, dinerId);
        }
    }
}
