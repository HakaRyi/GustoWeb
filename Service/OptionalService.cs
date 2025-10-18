using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository;
using Repository.Models;
using Service.DTO.Request;

namespace Service
{
    public class OptionalService
    {
        private readonly OptionalRepository repository;
        public OptionalService(OptionalRepository repository) => this.repository = repository;
        public async Task<List<Optional>> GetAllAsync()
        {
            try
            {
                return await repository.GetAllAsync();
            }
            catch (Exception ex)
            {
            }
            return new List<Optional>();
        }
        public async Task<Optional> GetByIdAsync(short id)
        {
            try
            {
                return await repository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
            }
            return new Optional();
        }
        public async Task<List<Optional>> GetOptByMenuAsync(short id)
        {
            try
            {
                return await repository.GetOptByMenuAsync(id);
            }
            catch (Exception ex)
            {
            }
            return new List<Optional>();
        }

        public async Task<int> Create(short menuId,OptionalRequest request)
        {
            try
            {
                var option = new Optional
                {
                    RestaurantMenuId = menuId,
                    Title = request.Name,
                    Price = request.Price

                };
                return await repository.CreateAsync(option);
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<int> Update(short optionId, short accountId, OptionalRequest request)
        {
            try
            {
                var option = await repository.GetByIdAsync(optionId);
                if (accountId == option.RestaurantMenu.AccountId)
                {
                  option = new Optional
                    {
                        Title = request.Name,
                        Price = request.Price

                    };
                    return await repository.UpdateAsync(option);
                }
                return 0;
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<bool> Delete(short optionId, short accountId)
        {
            try
            {
                var option = await repository.GetByIdAsync(optionId);
                if (accountId == option.RestaurantMenu.AccountId)
                {

                    return await repository.DeleteAsync(optionId);
                }
                return false;
            }
            catch (Exception ex)
            {
            }
            return false;
        }
    }
}
