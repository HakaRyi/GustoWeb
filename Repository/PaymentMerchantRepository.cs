using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Repository.DBContext;
using Repository.Models;

namespace Repository
{
    public class PaymentMerchantRepository
    {
        private readonly GustoSystemContext context;
        public PaymentMerchantRepository(GustoSystemContext context)
        { 
            this.context = context;
        }
        public async Task<List<PaymentMerchant>> GetAllAsync()
        {
            return await context.PaymentMerchants
                .Include(pm=>pm.Account)
                .ToListAsync();
        }
        public async Task<PaymentMerchant> GetByIdAsync(short id)
        {
            return await context.PaymentMerchants
                .Include(pm => pm.Account)
                .FirstOrDefaultAsync(pm => pm.Id == id);
        }
        public async Task<PaymentMerchant> GetByMeAsync(short accountid)
        {
            return await context.PaymentMerchants
                .Include(pm => pm.Account)
                .FirstOrDefaultAsync(pm => pm.AccountId == accountid);
        }
        public async Task<int> CreateAsync(PaymentMerchant paymentMerchant)
        {
            context.PaymentMerchants.Add(paymentMerchant);
            return await context.SaveChangesAsync();
        }
        public async Task<int> UpdateAsync(PaymentMerchant paymentMerchant)
        {
            context.PaymentMerchants.Update(paymentMerchant);
            return await context.SaveChangesAsync();
        }
        public async Task<bool> DeleteAsync(short id)
        {
            var paymentAccount = await GetByIdAsync(id);
            if(paymentAccount != null)
            {
                context.PaymentMerchants.Remove(paymentAccount);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

    }
}
