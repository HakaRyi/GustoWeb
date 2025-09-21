using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository;
using Repository.Models;
using Service.DTO.Response;

namespace Service
{
    public class RestaurantProfileService
    {
        private readonly RestaurantProfileRepository repository;
        public RestaurantProfileService(RestaurantProfileRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<RestaurantProfile>> GetAllAsync1()
        {
            try
            {
                return await repository.GetAllAsync();

            }
            catch (Exception ex)
            {
            }
            return new List<RestaurantProfile>();
        }
        public async Task<List<RestaurantProfileResponse>> GetAllAsync2()
        {
            try
            {
                return await repository.GetAllAsync()
                    .ContinueWith(task=>task.Result.Select(resPro => new RestaurantProfileResponse { 
                AccountId = resPro.AccountId,
                Address = resPro.Address,
                AvatarUrl = resPro.AvatarUrl,
                Description = resPro.Description,
                Email = resPro.Email,
                FacebookUrl = resPro.FacebookUrl,
                FullName = resPro.FullName,
                OpenHour = resPro.OpenHour,
                Phone = resPro.Phone,
                TiktokUrl = resPro.TiktokUrl,
                }).ToList());
                 
 
            }
            catch (Exception ex)
            {
            }
            return new List<RestaurantProfileResponse>();
        }
        public async Task<RestaurantProfileResponse> GetByIdAsync(int id)
        {
            try
            {
                var item = await repository.GetByIdAsync(id);
                return new RestaurantProfileResponse
                {
                    AccountId = item.AccountId,
                    Address = item.Address,
                    AvatarUrl = item.AvatarUrl,
                    Description = item.Description,
                    Email = item.Email,
                    FacebookUrl = item.FacebookUrl,
                    FullName = item.FullName,
                    OpenHour = item.OpenHour,
                    Phone = item.Phone,
                    TiktokUrl = item.TiktokUrl
                };
            }catch(Exception e)
            {

            }
            return new RestaurantProfileResponse();
        }
    }
}
