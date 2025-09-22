using Microsoft.EntityFrameworkCore;
using Repository.DBContext;
using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class AccountRepository
    {
        private readonly GustoSystemContext _context;

        public AccountRepository(GustoSystemContext context)
        {
            _context = context;
        }

        //CRUD Operations:

        public async Task<Account> CreateAccount (Account account)
        {
            var proccess = await _context.AddAsync(account);
            _context.SaveChanges();
            return proccess.Entity;
        }

        public async Task<List<Account>> GetAllAccounts()
        {
            return await _context.Accounts
                .Include(a => a.Notifications)
                .Include(a => a.RestaurantProfile)
                .Include(a => a.DinerProfile)
                .Include(a => a.RefreshTokens)
                .ToListAsync();
        }

        public async Task<Account> GetAccountById(short id)
        {
            return await _context.Accounts
                .Include(a => a.Notifications)
                .Include(a => a.RestaurantProfile)
                .Include(a => a.DinerProfile)
                .Include(a => a.RefreshTokens)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Account> UpdateAccount(Account account)
        {
            var proccess = _context.Update(account);
            await _context.SaveChangesAsync();
            return proccess.Entity;
        }

        public async Task<bool> DeleteAccount(short id)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == id);
            if (account == null)
            {
                return false;
            }
            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();
            return true;
        }
        //END CRUD Operations
        //Other Operations:
        public async Task<Account> SignInAsync(string username, string password)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.UserName == username && a.Password == password);
            return account;
        }

    }
}
