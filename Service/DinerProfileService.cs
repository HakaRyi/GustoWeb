using Repository.Models;
using Repository;
using Service.DTO.Request;
using Service.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class DinerProfileService
    {
        private readonly DinerProfileRepository _repository;

        public DinerProfileService(DinerProfileRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<DinerProfileResponse>> GetAllAsync()
        {
            var list = await _repository.GetAllAsync();
            return list.Select(MapToResponse);
        }

        public async Task<DinerProfileResponse?> GetByIdAsync(short id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity == null ? null : MapToResponse(entity);
        }

        public async Task<bool> AddAsync(DinerProfileRequest request)
        {
            var entity = new DinerProfile
            { 
                AvatarUrl = request.AvatarUrl,
                FullName = request.FullName,
                Phone = request.Phone,
                Age = request.Age,
                Address = request.Address,
                Gender = request.Gender,
                Email = request.Email,
                Job = request.Job,
                Description = request.Description,
                FacebookUrl = request.FacebookUrl,
                TiktokUrl = request.TiktokUrl,
                RewardPoints = request.RewardPoints ?? 0
            };

            await _repository.AddAsync(entity);
            return true;
        }

        public async Task<bool> UpdateAsync(short id, DinerProfileRequest request)
        {
            var entity = await _repository.GetById2Async(id);
            if (entity == null) return false;

            entity.AvatarUrl = request.AvatarUrl;
            entity.FullName = request.FullName;
            entity.Phone = request.Phone;
            entity.Age = request.Age;
            entity.Address = request.Address;
            entity.Gender = request.Gender;
            entity.Email = request.Email;
            entity.Job = request.Job;
            entity.Description = request.Description;
            entity.FacebookUrl = request.FacebookUrl;
            entity.TiktokUrl = request.TiktokUrl;
            entity.RewardPoints = request.RewardPoints;
            try
            {
                await _repository.UpdateAsync(entity);
            }catch (Exception ex)
            {

            }
            
            return true;
        }

        public async Task<bool> UpdateAvtAsync(string avt, short id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;
            entity.AvatarUrl = avt;
            await _repository.UpdateAsync(entity);
            return true;
        }

        public async Task<bool> DeleteAsync(short id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            await _repository.DeleteAsync(id);
            return true;
        }

        private static DinerProfileResponse MapToResponse(DinerProfile entity)
        {
            return new DinerProfileResponse
            {
                AccountId = entity.AccountId,
                AvatarUrl = entity.AvatarUrl,
                FullName = entity.FullName,
                Phone = entity.Phone,
                Age = entity.Age,
                Address = entity.Address,
                Gender = entity.Gender,
                Email = entity.Email,
                Job = entity.Job,
                Description = entity.Description,
                FacebookUrl = entity.FacebookUrl,
                TiktokUrl = entity.TiktokUrl,
                RewardPoints = entity.RewardPoints,
                Bookings = (List<Booking>) entity.Bookings
            };
        }
    }
}