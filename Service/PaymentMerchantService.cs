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
    public class PaymentMerchantService
    {
        private readonly PaymentMerchantRepository paymentMerchantRepository;
        public PaymentMerchantService(PaymentMerchantRepository paymentMerchantRepository)
        {
            this.paymentMerchantRepository = paymentMerchantRepository;
        }
        public async Task<List<PaymentMerchant>> GetAllAsync()
        {
            try
            {
                return await paymentMerchantRepository.GetAllAsync();
            }
            catch (Exception ex)
            {
            }
            return new List<PaymentMerchant>();
        }
        public async Task<PaymentMerchant> GetByIdAsync(short id)
        {
            try
            {
                return await paymentMerchantRepository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
            }
            return new PaymentMerchant();
        }
        public async Task<PaymentMerchant> GetByMeAsync(short accountId)
        {
            try
            {
                return await paymentMerchantRepository.GetByMeAsync(accountId);
            }
            catch (Exception ex)
            {
            }
            return new PaymentMerchant();
        }
        public async Task<int> Create(AddPaymentMerchantRequest request)
        {
            try
            {
                PaymentMerchant merchant = new PaymentMerchant();
                merchant.AccountId = request.AccountId;
                merchant.BankAccountName = request.BankAccountName;
                merchant.BankNo = request.BankNo;
                merchant.Bank = request.Bank;
                return await paymentMerchantRepository.CreateAsync(merchant);
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<int> Update(short paymentMerchantId, short accountId, PaymentMerchant request)
        {
            try
            {
                var paymentMerchant = await paymentMerchantRepository.GetByIdAsync(paymentMerchantId);
                if (accountId ==paymentMerchant.AccountId )
                {
                    paymentMerchant.BankAccountName = request.BankAccountName;
                    paymentMerchant.BankNo = request.BankNo;
                    paymentMerchant.Bank = request.Bank;
                    paymentMerchant.UpdateAt = DateTime.Now;
                    return await paymentMerchantRepository.UpdateAsync(paymentMerchant);
                }
                return 0;
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<bool> Delete(short paymentMerchantId, short accountId)
        {
            try
            {
                var paymentMerchant = await paymentMerchantRepository.GetByIdAsync(paymentMerchantId);
                if (accountId == paymentMerchant.AccountId)
                {

                    return await paymentMerchantRepository.DeleteAsync(paymentMerchantId);
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
