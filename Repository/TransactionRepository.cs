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
    public class TransactionRepository
    {
        private readonly GustoSystemContext context;
        public TransactionRepository(GustoSystemContext context) => this.context = context;
        public async Task<List<Transaction>> GetAll()
        {
            return await context.Transactions
                .Include(t => t.Booking)
                    .ThenInclude(b => b.Diner)      
                .Include(t => t.Booking)
                    .ThenInclude(b => b.Restaurant) 
                .OrderByDescending(t => t.Timestamp) 
                .ToListAsync();
        }
        public async Task<Transaction> GetById(short id)
        {
            return await context.Transactions
                .Include(t => t.Booking)
                .FirstOrDefaultAsync(t=>t.Id == id);
        }
        public async Task<int> Create(Transaction transaction)
        {
            context.Transactions.Add(transaction);
            return await context.SaveChangesAsync();
            
        }
        public async Task<int> Update(Transaction transaction)
        {
            context.Transactions.Update(transaction);
            return await context.SaveChangesAsync();

        }
        public async Task<bool> Delete(short id)
        {
            var transaction = await GetById(id);
            if(transaction != null)
            {
                context.Transactions.Remove(transaction);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        
    }
}
