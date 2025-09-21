using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Repository;
using Repository.Models;
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
    }
}
