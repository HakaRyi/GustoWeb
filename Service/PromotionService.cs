using Repository.Models;
using Repository;
using Service.DTO.Request;
using Service.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Service
{
    public class PromotionService
    {
        private readonly PromotionRepository _promotionRepository;

        public PromotionService(PromotionRepository promotionRepository)
        {
            _promotionRepository = promotionRepository;
        }

        public async Task<List<PromotionResponse>> GetAllAsync()
        {
            var list = await _promotionRepository.GetAllAsync();
            return list.Select(MapToResponse).ToList();
        }

        public async Task<PromotionResponse?> GetByIdAsync(short id)
        {
            var promo = await _promotionRepository.GetByIdAsync(id);
            return promo == null ? null : MapToResponse(promo);
        }

        public async Task<List<PromotionResponse>> GetByAccountIdAsync(short accountId)
        {
            var list = await _promotionRepository.GetByAccountIdAsync(accountId);
            return list.Select(MapToResponse).ToList();
        }

        public async Task<PromotionResponse?> GetByCodeAsync(string code)
        {
            var promo = await _promotionRepository.GetByCodeAsync(code);
            return promo == null ? null : MapToResponse(promo);
        }

        public async Task AddAsync(PromotionRequest request)
        {
            var promo = new Promotion
            {
                Code = request.Code,
                Description = request.Description,
                DiscountPercent = request.DiscountPercent,
                DiscountAmount = request.DiscountAmount,
                MinOrderValue = request.MinOrderValue,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                CreatedByAdmin = request.CreatedByAdmin,
                AccountId = request.AccountId
            };

            await _promotionRepository.AddAsync(promo);
        }

        public async Task UpdateAsync(short id, PromotionRequest request)
        {
            var promo = new Promotion
            {
                PromotionId = id,
                Code = request.Code,
                Description = request.Description,
                DiscountPercent = request.DiscountPercent,
                DiscountAmount = request.DiscountAmount,
                MinOrderValue = request.MinOrderValue,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                CreatedByAdmin = request.CreatedByAdmin,
                AccountId = request.AccountId
            };

            await _promotionRepository.UpdateAsync(promo);
        }

        public async Task DeleteAsync(short id)
        {
            await _promotionRepository.DeleteAsync(id);
        }

        private PromotionResponse MapToResponse(Promotion promo)
        {
            return new PromotionResponse
            {
                PromotionId = promo.PromotionId,
                Code = promo.Code,
                Description = promo.Description,
                DiscountPercent = promo.DiscountPercent,
                DiscountAmount = promo.DiscountAmount,
                MinOrderValue = promo.MinOrderValue,
                StartDate = promo.StartDate,
                EndDate = promo.EndDate,
                CreatedByAdmin = promo.CreatedByAdmin,
                AccountId = promo.AccountId,
                AccountName = promo.Account?.Email
            };
        }
    }
}
