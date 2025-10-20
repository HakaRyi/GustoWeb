using Microsoft.EntityFrameworkCore;
using Repository.DBContext;
using Repository.ModelExtensions;
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

        public async Task<Account> CreateAccount(Account account)
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
                .Include(a => a.Role)
                .ToListAsync();
        }

        public async Task<Account> GetAccountById(short id)
        {
            return await _context.Accounts
                .Include(a => a.Notifications)
                .Include(a => a.RestaurantProfile)
                .Include(a => a.DinerProfile)
                .Include(a => a.RefreshTokens)
                .Include(a => a.Role)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Account> GetAccountByUserName(string username)
        {
            return await _context.Accounts
                .Include(a => a.Notifications)
                .Include(a => a.RestaurantProfile)
                .Include(a => a.DinerProfile)
                .Include(a => a.RefreshTokens)
                .Include(a => a.Role)
                .FirstOrDefaultAsync(a => a.UserName == username && a.Status.ToLower() == "active");
        }
        public async Task<Account> GetAccountByEmail(string email) { 
            return await _context.Accounts
                .Include(a => a.Notifications)
                .Include(a => a.RestaurantProfile)
                .Include(a => a.DinerProfile)
                .Include(a => a.RefreshTokens)
                .Include(a => a.Role)
                .FirstOrDefaultAsync(a => a.DinerProfile.Email == email && a.Status.ToLower() == "active"); }
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

        public async Task<List<Account>> SearchAsync(string name, int roleId, string profileName)
        {
            var items = await _context.Accounts
               .Include(a => a.Notifications)
                .Include(a => a.RestaurantProfile)
                .Include(a => a.DinerProfile)
                .Include(a => a.RefreshTokens)
                .Include(a => a.Role)
                .Where(a => a.UserName.Contains(name) || string.IsNullOrEmpty(name)
                && (a.RoleId == roleId)
                && (a.RestaurantProfile.FullName.Equals(profileName) || a.DinerProfile.FullName.Equals(profileName)))
                .OrderBy(x => x.CreateAt)
                .ToListAsync();
            return items ?? new List<Account>();
        }

        public async Task<PaginationResult<List<Account>>> SearchWithPagingAsync(string name, int roleId, string profileName, int currentPage, int pageSize)
        {
            var items = await this.SearchAsync(name, roleId, profileName);

            var totalItems = items.Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            items = items.Skip((currentPage - 1) * pageSize).Take(pageSize).ToList();

            var result = new PaginationResult<List<Account>>
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = currentPage,
                PageSize = pageSize,
                Items = items
            };

            return result ?? new PaginationResult<List<Account>>();

        }

        public async Task<bool> isPhoneExist(string phone)
        {
             return await _context.Accounts.AnyAsync(a => a.DinerProfile.Phone == phone || a.RestaurantProfile.Phone == phone);
        }
    }
}
