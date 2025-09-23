using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository;
using Repository.Models;
using Service.DTO.Request;
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
        public async Task<RestaurantProfile> GetByIdAsync(int id)
        {
            try
            {
                return await repository.GetByIdAsync(id);

            }
            catch (Exception ex)
            {
            }
            return new RestaurantProfile();
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
        public async Task<RestaurantProfileResponse> GetByIdAsync2(int id)
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

        public async Task<List<RestaurantProfileResponse>> GetByAccountAsync(int accId)
        {
            try
            {
                return await repository.GetByAccountAsync(accId)
                    .ContinueWith(task => task.Result.Select(resPro => new RestaurantProfileResponse
                    {
                        AccountId =resPro.AccountId,
                        Address = resPro.Address,
                        AvatarUrl = resPro.AvatarUrl,
                        Description=resPro.Description,
                        Email = resPro.Email,
                        FacebookUrl = resPro.FacebookUrl,
                        FullName = resPro.FullName,
                        OpenHour = resPro.OpenHour,
                        Phone = resPro.Phone,
                        TiktokUrl = resPro.TiktokUrl
                        


                    }).ToList());
            }
            catch (Exception e)
            {

            }
            return new List<RestaurantProfileResponse>();
        }
        public async Task<int> CreateProfileAsync(RestaurantProfileRequest request, short restaurantID)
        {
            var newItem = new RestaurantProfile
            {
                FullName = null,
                TiktokUrl= null,
                Description = null,  
                Email = null,
                FacebookUrl = null,
                Phone = null,
                OpenHour=  null,
                Address = null,
                AvatarUrl = null,
                

            };
            return await repository.CreateAsync(newItem);
        }
        public async Task<int> UpdateProfileAsync(RestaurantProfileRequest request, int profileId)
        {
            var item = await GetByIdAsync(profileId);
            if (item == null)
            {
                throw new KeyNotFoundException($"Profile with ID {profileId} not found.");
            }
            item.Address = request.Address;
            item.AvatarUrl = request.AvatarUrl;
            item.Email = request.Email;
            item.FacebookUrl = request.FacebookUrl; 
            item.Phone = request.Phone;
            item.OpenHour = request.OpenHour;
            item.TiktokUrl = request.TiktokUrl;
            item.Description = request.Description;
            item.FullName = request.FullName;

            return await repository.UpdateAsync(item);
        }
        public async Task<int> DeleteProfileAsync(int profileId)
        {
            var item = await GetByIdAsync(profileId);
            if (item == null)
            {
                throw new KeyNotFoundException($"Profile with ID {profileId} not found.");
            }
            return await repository.DeleteAsync(profileId);
        }
    }
}
