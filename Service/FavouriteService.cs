using Repository;
using Repository.Models;
using Service.DTO.Request;
using Service.DTO.Response;
using Service.DTO.Request;
using Service.DTO.Response;

namespace Service
{
    public class FavouriteService
    {
        private readonly FavouriteRepository _repository;

        public FavouriteService(FavouriteRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<RestaurantProfile>> GetByDinerIdAsync(short dinerId)
        {
            var favs = await _repository.GetByDinerIdAsync(dinerId);

            return favs.Select(f => f.Restaurant).ToList();
        }
        public async Task<List<Favourite>> GetAccountsLikeRes(short resId)
        {
            try
            {
                return await _repository.GetAccountsLikeRes(resId);
            }
            catch 
            {

            }
            return new List<Favourite>();
            

        }

        public async Task<FavouriteResponse?> GetByIdAsync(short id)
        {
            var fav = await _repository.GetByIdAsync(id);
            if (fav == null) return null;

            return new FavouriteResponse
            {
                Id = fav.Id,
                DinerId = fav.DinerId,
                RestaurantId = fav.RestaurantId,
                CreatedAt = fav.CreatedAt,
                RestaurantName = fav.Restaurant?.FullName
            };
        }
        public async Task<bool> IsResLiked(short dinerId, short resId)
        {
            var fav = await _repository.GetMyFavorate(dinerId,resId);
            if (fav == null) {
                return false;
            }
            else
            {
                return true;
            }

        }

        public async Task AddAsync(FavouriteRequest request)
        {
            var fav = new Favourite
            {
                DinerId = request.DinerId,
                RestaurantId = request.RestaurantId,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(fav);
        }

        public async Task UpdateAsync(short id, FavouriteRequest request)
        {
            var fav = new Favourite
            {
                Id = id,
                DinerId = request.DinerId,
                RestaurantId = request.RestaurantId,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.UpdateAsync(fav);
        }

        public async Task DeleteAsync(short id, short dinerId)
        {
            await _repository.DeleteAsync(id, dinerId);
        }
    }
}
