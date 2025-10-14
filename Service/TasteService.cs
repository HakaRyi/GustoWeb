using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository;
using Repository.Models;

namespace Service
{
    public class TasteService
    {
        private readonly TasteRepository repository;
        public TasteService(TasteRepository repository) => this.repository = repository;
        public async Task<List<Taste>> GetAllAsync()
        {
            try
            {
                return await repository.GetAllAsync();
            }
            catch (Exception ex)
            {
            }
            return new List<Taste>();
        }
        public async Task<List<Taste>> GetTasteByMenuAsync(short id)
        {
            try
            {
                return await repository.GetTasteByMenuAsync(id);
            }
            catch (Exception ex)
            {
            }
            return new List<Taste>();
        }
        public async Task<Taste> GetByIdAsync(short id)
        {
            try
            {
                return await repository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
            }
            return new Taste();
        }
  
        public async Task<int> Create(Taste taste)
        {
            try
            {
                return await repository.CreateAsync(taste);
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<int> Update(short tasteId, short accountId)
        {
            try
            {
                var taste = await repository.GetByIdAsync(tasteId);
                if (accountId == taste.RestaurantMenu.AccountId)
                {

                    return await repository.UpdateAsync(taste);
                }
                return 0;
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<bool> Delete(short tasteId, short accountId)
        {
            try
            {
                var taste = await repository.GetByIdAsync(tasteId);
                if (accountId == taste.RestaurantMenu.AccountId)
                {

                    return await repository.DeleteAsync(tasteId);
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
