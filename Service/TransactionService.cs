using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository;
using Repository.Models;

namespace Service
{
    public class TransactionService
    {
        private readonly TransactionRepository repository;
        public TransactionService(TransactionRepository repository) => this.repository = repository;
        public async Task<List<Transaction>> GetAll()
        {
            try
            {
                return await repository.GetAll();
            }
            catch (Exception ex)
            {
            }
            return new List<Transaction>();
        }
        public async Task<Transaction> GetById(short id)
        {
            try
            {
                return await repository.GetById(id);
            }
            catch (Exception ex)
            {
            }
            return new Transaction();
        }
        public async Task<int> Create(Transaction transaction)
        {
            try
            {
                return await repository.Create(transaction);
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<int> Update(short id)
        {
            try
            {
                var transaction = await GetById(id);
                return await repository.Create(transaction);
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<bool> Delete(short id)
        {
            try
            {
               
                return await repository.Delete(id);
            }
            catch (Exception ex)
            {
            }
            return false;
        }
    }
}
