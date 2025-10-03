using Org.BouncyCastle.Ocsp;
using Repository;
using Repository.Models;
using Service.DTO.Request;
using Service.DTO.Response;

namespace Service
{
    public class RestaurantLayoutService
    {
        private readonly RestaurantLayoutRepository repository;
        public RestaurantLayoutService(RestaurantLayoutRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<RestaurantLayout>> GetAllAsync1()
        {
            try
            {
                return await repository.GetAllAsync();

            }
            catch (Exception ex)
            {
            }
            return new List<RestaurantLayout>();
        }
        public async Task<RestaurantLayout> GetByIdAsync(int id)
        {
            try
            {
                return await repository.GetByIdAsync(id);

            }
            catch (Exception ex)
            {
            }
            return new RestaurantLayout();
        }
        public async Task<List<RestaurantLayoutResponse>> GetAllAsync2()
        {
            try
            {
                return await repository.GetAllAsync()
                    .ContinueWith(task=>task.Result.Select(resLay => new RestaurantLayoutResponse {
                LayoutId = resLay.LayoutId,
                Description = resLay.Description,
                Name = resLay.Name,
                RestaurantName = resLay.Account.FullName,
                LayoutImgUrl = resLay.LayoutUrl

                }).ToList());
                 
 
            }
            catch (Exception ex)
            {
            }
            return new List<RestaurantLayoutResponse>();
        }
        public async Task<RestaurantLayoutResponse> GetByIdAsync2(int id)
        {
            try
            {
                var item = await repository.GetByIdAsync(id);
                return new RestaurantLayoutResponse
                {
                    LayoutId= item.LayoutId,
                    Description = item.Description,
                    Name = item.Name,
                    LayoutImgUrl= item.LayoutUrl,
                    RestaurantName = item.Account.FullName

                };
            }
            catch (Exception e)
            {

            }
            return new RestaurantLayoutResponse();
        }
        public async Task<List<RestaurantLayoutResponse>> GetByAccountAsync(int accId)
        {
            try
            {
                return await repository.GetByAccountAsync(accId)
                    .ContinueWith(task => task.Result.Select(resLay => new RestaurantLayoutResponse
                    {
                        LayoutId = resLay.LayoutId,
                        Description = resLay.Description,
                        Name = resLay.Name,
                        RestaurantName = resLay.Account.FullName,
                        LayoutImgUrl = resLay.LayoutUrl

                    }).ToList());
            }
            catch (Exception e)
            {

            }
            return new List<RestaurantLayoutResponse>();
        }
        public async Task<int> CreateLayoutAsync(RestaurantLayoutRequest request, short restaurantID)
        {
            var newItem = new RestaurantLayout
            {
                Name = request.Name,
                Description = request.Description ?? "",
                LayoutUrl = request.LayoutUrl ?? "",
                AccountId = restaurantID

            };
            return await repository.CreateAsync(newItem);
        }
        public async Task<int> UpdateLayoutAsync(RestaurantLayoutRequest request, int layoutId, short resId)
        {
            var item = await GetByIdAsync(layoutId);
            if (item == null)
            {
                throw new KeyNotFoundException($"Layout with ID {layoutId} not found.");
            }
            if (resId != item.AccountId) throw new UnauthorizedAccessException("You dont have permission to edit this layout");

            item.Description = request.Description;
            item.Name = request.Name;
            item.LayoutUrl = request.LayoutUrl;

            return await repository.UpdateAsync(item);
        }
        public async Task<int> DeleteLayoutAsync(int layoutId, short resId)
        {
            var item = await GetByIdAsync(layoutId);

            if (item == null)
            {
                throw new KeyNotFoundException($"Layout with ID {layoutId} not found.");
            }
            if (resId != item.AccountId) throw new UnauthorizedAccessException("You dont have permission to delete this layout");

            return await repository.DeleteAsync(layoutId);
        }

    }
}
