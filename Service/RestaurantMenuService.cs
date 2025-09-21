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
    }
}
