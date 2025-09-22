using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Repository;
using Repository.Models;
using Service.DTO.Request;
using Service.DTO.Response;

namespace Service
{
    public class RestaurantMenuService
    {
        private readonly RestaurantMenuRepository repository;
        public RestaurantMenuService(RestaurantMenuRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<RestaurantMenu>> GetAllAsync1()
        {
            try
            {
                return await repository.GetAll();

            }
            catch (Exception ex)
            {
            }
            return new List<RestaurantMenu>();
        }
        public async Task<RestaurantMenu> GetByIdAsync(int id)
        {
            try
            {
                return await repository.GetByIdAsync(id);

            }
            catch (Exception ex)
            {
            }
            return new RestaurantMenu();
        }
        public async Task<List<RestaurantMenuResponse>> GetAllAsync2()
        {
            try
            {
                return await repository.GetAll()
                    .ContinueWith(task=>task.Result.Select(resFood => new RestaurantMenuResponse
                    {
                    FoodId = resFood.FoodId,
                    Status = resFood.Status,
                    Description = resFood.Description,
                    DiscountPercent = resFood.DiscountPercent,
                    EndDiscount = resFood.EndDiscount,
                    StartDiscount = resFood.StartDiscount,
                    FoodImgUrl = resFood.FoodUrl,
                    FoodName = resFood.Name,
                    IsRecommended = resFood.IsRecommended,
                    OldPrice = resFood.OldPrice,
                    Price = resFood.Price,
                    RestaurantName = resFood.Name,
                    Type = resFood.Type 
                    


                    }).ToList());
                 
 
            }
            catch (Exception ex)
            {
            }
            return new List<RestaurantMenuResponse>();
        }
        public async Task<RestaurantMenuResponse> GetByIdAsync2(int id)
        {
            try
            {
                var resFood = await repository.GetByIdAsync(id);
                return new RestaurantMenuResponse
                {
                    FoodId = resFood.FoodId,
                    Status = resFood.Status,
                    Description = resFood.Description,
                    DiscountPercent = resFood.DiscountPercent,
                    EndDiscount = resFood.EndDiscount,
                    StartDiscount = resFood.StartDiscount,
                    FoodImgUrl = resFood.FoodUrl,
                    FoodName = resFood.Name,
                    IsRecommended = resFood.IsRecommended,
                    OldPrice = resFood.OldPrice,
                    Price = resFood.Price,
                    RestaurantName = resFood.Name,
                    Type = resFood.Type

                };
            }
            catch (Exception e)
            {

            }
            return new RestaurantMenuResponse();
        }
        public async Task<List<RestaurantMenuResponse>> GetByAccountAsync(int accId)
        {
            try
            {
                return await repository.GetByAccountAsync(accId)
                    .ContinueWith(task => task.Result.Select(resFood => new RestaurantMenuResponse
                    {
                        FoodId = resFood.FoodId,
                        Status = resFood.Status,
                        Description = resFood.Description,
                        DiscountPercent = resFood.DiscountPercent,
                        EndDiscount = resFood.EndDiscount,
                        StartDiscount = resFood.StartDiscount,
                        FoodImgUrl = resFood.FoodUrl,
                        FoodName = resFood.Name,
                        IsRecommended = resFood.IsRecommended,
                        OldPrice = resFood.OldPrice,
                        Price = resFood.Price,
                        RestaurantName = resFood.Name,
                        Type = resFood.Type

                    }).ToList());
            }
            catch (Exception e)
            {

            }
            return new List<RestaurantMenuResponse>();
        }
        public async Task<int> CreateMenuAsync(RestaurantMenuRequest request, short restaurantID)
        {
            var newItem = new RestaurantMenu
            {
               Name = request.Name,
               Price = request.Price,
               OldPrice = request.OldPrice,
               DiscountPercent= request.DiscountPercent,
               StartDiscount= request.StartDiscount,
               EndDiscount= request.EndDiscount,
               IsRecommended = request.IsRecommended,
               Status = request.Status,
               Type = request.Type,
               FoodUrl = request.FoodUrl,
               Description = request.Description,

            };
            return await repository.CreateAsync(newItem);
        }
        public async Task<int> UpdateMenuAsync(RestaurantMenuRequest request, int menuId)
        {
            var item = await GetByIdAsync(menuId);
            if (item == null)
            {
                throw new KeyNotFoundException($"Menu with ID {menuId} not found.");
            }
            item.Name = request.Name;
            item.Price = request.Price;
            item.OldPrice = request.OldPrice;
            item.DiscountPercent = request.DiscountPercent;
            item.StartDiscount = request.StartDiscount;
            item.EndDiscount = request.EndDiscount;
            item.Status = request.Status;
            item.Type = request.Type;
            item.IsRecommended = request.IsRecommended;
            item.FoodUrl = request.FoodUrl;
            item.Description = request.Description;

            return await repository.UpdateAsync(item);
        }
        public async Task<int> DeleteMenuAsync(int menuId)
        {
            var item = await GetByIdAsync(menuId);
            if (item == null)
            {
                throw new KeyNotFoundException($"Menu with ID {menuId} not found.");
            }
            return await repository.DeleteAsync(menuId);
        }
    }
}
