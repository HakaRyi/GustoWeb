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
    public class NotificationRepository
    {
        private readonly GustoSystemContext _context;

        public NotificationRepository(GustoSystemContext context)
        {
            _context = context;
        }

        //CRUD Operations:
        public async Task<Notification> Create(Notification notification)
        {
            var res = await _context.AddAsync(notification);
            await _context.SaveChangesAsync();
            return res.Entity;
        }

        public async Task<List<Notification>> GetAll()
        {
            return await _context.Notifications.ToListAsync();
        }

        public async Task<Notification> GetById(int id)
        {
            return await _context.Notifications.FindAsync(id);
        }

        public async Task<Notification> Update(Notification notification)
        {
            var res = _context.Update(notification);
            await _context.SaveChangesAsync();
            return res.Entity;
        }

        public async Task<bool> Delete(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                return false;
            }
            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
            return true;
        }

        //End CRUD Operations

        public async Task<List<Notification>> GetByAccountId(short accountId)
        {
            return await _context.Notifications
                                 .Where(n => n.AccountId == accountId)
                                 .ToListAsync();
        }

        public async Task<PaginationResult<List<Notification>>> GetAllPaging( int currentPage, int pageSize)
        {
            var items = await this.GetAll();

            var totalItems = items.Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            items = items.Skip((currentPage - 1) * pageSize).Take(pageSize).ToList();

            var result = new PaginationResult<List<Notification>>
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = currentPage,
                PageSize = pageSize,
                Items = items
            };

            return result ?? new PaginationResult<List<Notification>>();

        }

    }    
}
