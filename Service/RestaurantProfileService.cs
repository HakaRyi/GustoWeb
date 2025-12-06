using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Org.BouncyCastle.Ocsp;
using Repository;
using Repository.DBContext; 
using Repository.Models;
using Service.DTO.Request;
using Service.DTO.Response;

namespace Service
{
    public class RestaurantProfileService
    {
        private readonly RestaurantProfileRepository repository;
        private readonly AccountRepository accRepo;
        private readonly FoodReviewRepository foodReviewRepository;
        private readonly GustoSystemContext _context;
        private readonly BookingRepository bookingRepository;
        public RestaurantProfileService(RestaurantProfileRepository repository, AccountRepository accRepo, FoodReviewRepository foodReviewRepository, GustoSystemContext context, BookingRepository bookingRepository)
        {
            this.repository = repository;
            this.accRepo = accRepo;
            this.foodReviewRepository = foodReviewRepository;
            _context = context;
            this.bookingRepository = bookingRepository;
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
        public async Task<RestaurantProfile> GetByIdAsync3(int id)
        {
            try
            {
                return await repository.GetByIdAsync3(id);

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
      
                var restaurantProfiles = await repository.GetAllAsync();

                var result = new List<RestaurantProfileResponse>();

                foreach (var resPro in restaurantProfiles)
                {
                    var averageRating = await foodReviewRepository.GetAverageRatingByRestaurantIdAsync(resPro.AccountId);

                    result.Add(new RestaurantProfileResponse
                    {
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
                        CreateAt = resPro.CreateAt,
                        Duration = resPro.Duration,
                        Rating = (int)Math.Round(averageRating)
                    });
                }

                return result;
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
                var item = await repository.GetProfileBaseInfoAsync(id);
                if (item == null) return new RestaurantProfileResponse();

                double avgRating = await foodReviewRepository.GetAverageRatingByRestaurantIdAsync(id);

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
                    TiktokUrl = item.TiktokUrl,
                    Duration = item.Duration,
                    CreateAt = item.CreateAt,
                    Rating = (int)Math.Round(avgRating) // Làm tròn về int 0–5
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return new RestaurantProfileResponse();
        }

        public async Task<RestaurantProfileResponse> GetByAccountAsync(int accId)
        {
            try
            {
                var item = await repository.GetProfileBaseInfoAsync(accId);
                if (item == null) return new RestaurantProfileResponse();

                double avgRating = await foodReviewRepository.GetAverageRatingByRestaurantIdAsync(accId);

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
                    TiktokUrl = item.TiktokUrl,
                    CreateAt = item.CreateAt,
                    Duration = item.Duration,
                    Rating = (int)Math.Round(avgRating), // Làm tròn về int 0–5
                    paymentMerchant = item.PaymentMerchant,
                };
            }
            catch (Exception e)
            {
                
            }

            return new RestaurantProfileResponse();
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
                CreateAt= DateTime.Now,
                Duration = request.Duration,
                OpenAt=  request.OpenAt ?? null,
                CloseAt = request.CloseAt ?? null,
                Address = request.Address ?? null,
                AvatarUrl = request.AvatarUrl ?? null,
                
            };
            return await repository.CreateAsync(newItem);
        }
        public async Task<int> UpdateProfileAsync(RestaurantProfileRequest request, int profileId, short resId)
        {
            var item = await repository.GetByIdToUpdate(profileId);
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
            item.Duration = request.Duration;
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

        public async Task<decimal> RevenueByMonth(short profileId, int month, int year)
        {
            var res = await GetByIdAsync(profileId);
            if (res != null) 
            {
                var bookings = await bookingRepository.GetCompletedOrdersByMonthAsync(profileId,month,year);
                if (!bookings.Any())
                    return 0m;
                decimal totalRevenue = bookings.Sum(o => o.FinalPrice!.Value);
                decimal platformFee = bookings.Count * 3000m;
                return totalRevenue - platformFee;
            }
            else
            {
                return 0m;
            }
        }
        public async Task<string> BestSeller(short profileId)
        {
            var restaurant = await GetByIdAsync(profileId);
            if (restaurant == null)
                return "Không tìm thấy nhà hàng";

            var bestSellerName = await bookingRepository.GetBestSellerFoodName(profileId);

            return bestSellerName ?? "Chưa có đơn hàng nào";
        }
        // ===== ADMIN CRUD =====

        public async Task<int> AdminUpdateProfileAsync(int profileId, RestaurantProfileRequest request)
        {
            _context.ChangeTracker.Clear();

            var item = await _context.RestaurantProfiles
                                     .FirstOrDefaultAsync(x => x.AccountId == profileId);

            if (item == null)
                throw new Exception($"Profile with ID {profileId} not found.");

            item.FullName = request.FullName?.Trim();
            item.Phone = request.Phone?.Trim();
            item.Address = request.Address?.Trim();
            item.Email = request.Email?.Trim();

            item.OpenAt = request.OpenAt;
            item.CloseAt = request.CloseAt;

            item.Description = request.Description?.Trim();
            item.FacebookUrl = request.FacebookUrl?.Trim();
            item.TiktokUrl = request.TiktokUrl?.Trim();
            item.AvatarUrl = request.AvatarUrl?.Trim();

            if (request.Duration.HasValue) item.Duration = request.Duration.Value;

            _context.Attach(item);
            _context.Entry(item).State = EntityState.Modified;

            return await _context.SaveChangesAsync();
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
                AvatarUrl = request.AvatarUrl?.Trim(),
                CreateAt = DateTime.Now,
                Duration = request.Duration ?? 0
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

