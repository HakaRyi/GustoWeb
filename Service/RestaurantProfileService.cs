using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using Org.BouncyCastle.Ocsp;
using Repository;
using Repository.Models;
using Service.DTO.Request;
using Service.DTO.Response;

namespace Service
{
    public class RestaurantProfileService
    {
        private readonly RestaurantProfileRepository repository;
        private readonly AccountRepository accRepo;
        public RestaurantProfileService(RestaurantProfileRepository repository, AccountRepository accRepo)
        {
            this.repository = repository;
            this.accRepo = accRepo;
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
                OpenAt = resPro.OpenAt,
                CloseAt = resPro.CloseAt,
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
                    OpenAt = item.OpenAt,
                    CloseAt = item.CloseAt,
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
                        OpenAt=resPro.OpenAt,
                        CloseAt=resPro.CloseAt,
                        Phone = resPro.Phone,
                        TiktokUrl = resPro.TiktokUrl
                        


                    }).ToList());
            }
            catch (Exception e)
            {

            }
            return new List<RestaurantProfileResponse>();
        }
        public async Task<int> CreateProfileAsync(RestaurantProfileRequest request, short accId)
        {
            var acc = await accRepo.GetAccountById(accId);
            if(acc == null) throw new Exception($"Account with ID {accId} not found.");
            var existingProfile = await repository.GetByIdAsync(accId);
            if (existingProfile != null) throw new Exception("Profile already exists for this account.");
           
            var newItem = new RestaurantProfile
            {
                AccountId = accId,
                FullName = request.FullName ?? null,
                TiktokUrl= request.TiktokUrl ?? null,
                Description = request.Description ?? "",  
                Email = request.Email ?? null,
                FacebookUrl = request.FacebookUrl ?? null,
                Phone = request.Phone ?? null,
                OpenAt=  request.OpenAt ?? null,
                CloseAt = request.CloseAt ?? null,
                Address = request.Address ?? null,
                AvatarUrl = request.AvatarUrl ?? null,
                
            };
            return await repository.CreateAsync(newItem);
        }
        public async Task<int> UpdateProfileAsync(RestaurantProfileRequest request, int profileId, short resId)
        {
            var item = await GetByIdAsync(profileId);
            if (item == null)
            {
                throw new KeyNotFoundException($"Profile with ID {profileId} not found.");
            }
            if (resId != item.AccountId) throw new UnauthorizedAccessException("You dont have permission to edit this profile");

            item.Address = request.Address;
            item.AvatarUrl = request.AvatarUrl;
            item.Email = request.Email;
            item.FacebookUrl = request.FacebookUrl; 
            item.Phone = request.Phone;
            item.OpenAt = request.OpenAt;
            item.CloseAt = request.CloseAt;
            item.TiktokUrl = request.TiktokUrl;
            item.Description = request.Description;
            item.FullName = request.FullName;

            return await repository.UpdateAsync(item);
        }
        public async Task<int> DeleteProfileAsync(int profileId, short resId)
        {
            var item = await GetByIdAsync(profileId);
            if (item == null)
            {
                throw new KeyNotFoundException($"Profile with ID {profileId} not found.");
            }
            if (resId != item.AccountId) throw new UnauthorizedAccessException("You dont have permission to remove this profile");

            return await repository.DeleteAsync(profileId);
        }

        // ===== ADMIN CRUD =====

        public async Task<int> AdminUpdateProfileAsync(int profileId, RestaurantProfileRequest request)
        {
            var item = await repository.GetByIdAsync(profileId);
            if (item == null)
                throw new Exception($"Profile with ID {profileId} not found.");

            item.Address = request.Address;
            item.AvatarUrl = request.AvatarUrl;
            item.Email = request.Email;
            item.FacebookUrl = request.FacebookUrl; 
            item.Phone = request.Phone;
            item.OpenAt = request.OpenAt;
            item.CloseAt = request.CloseAt;
            item.TiktokUrl = request.TiktokUrl;
            item.Description = request.Description;
            item.FullName = request.FullName;

            return await repository.UpdateAsync(item);
        }

        public async Task<int> AdminDeleteProfileAsync(int profileId)
        {
            var item = await repository.GetByIdAsync(profileId);
            if (item == null)
                throw new Exception($"Profile with ID {profileId} not found.");

            return await repository.DeleteAsync(profileId);
        }

        public async Task<int> AdminCreateProfileAsync(RestaurantProfileRequest request, short accId)
        {
            // ✅ Kiểm tra Account có tồn tại không
            var acc = await accRepo.GetAccountById(accId);
            if (acc == null)
                throw new Exception($"Account with ID {accId} does not exist.");

            // ✅ Kiểm tra Account có phải là loại nhà hàng (nếu có Role)
            // if (acc.Role != "Restaurant") throw new Exception("Account is not a restaurant account.");

            // ✅ Kiểm tra đã có profile chưa
            var existingProfile = await repository.GetByIdAsync(accId);
            if (existingProfile != null)
                throw new Exception($"Account ID {accId} already has a RestaurantProfile.");

            // ✅ Tạo mới
            var newProfile = new RestaurantProfile
            {
                AccountId = accId,
                FullName = request.FullName?.Trim(),
                TiktokUrl = request.TiktokUrl?.Trim(),
                Description = request.Description?.Trim(),
                Email = request.Email?.Trim(),
                FacebookUrl = request.FacebookUrl?.Trim(),
                Phone = request.Phone?.Trim(),
                OpenAt = request.OpenAt,
                CloseAt = request.CloseAt,
                Address = request.Address?.Trim(),
                AvatarUrl = request.AvatarUrl?.Trim()
            };

            try
            {
                return await repository.CreateAsync(newProfile);
            }
            catch (Exception ex)
            {
                // ⚠️ Ghi log lỗi cụ thể để dễ debug
                throw new Exception($"Failed to create RestaurantProfile: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

    }
}

