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
    public class ContactRepository
    {
        private readonly GustoSystemContext _context;
        public ContactRepository(GustoSystemContext context)
        {
            _context = context;
        }
        public async Task<List<Contact>> GetAll()
        {
            return await _context.Contacts.ToListAsync();
        }
        public async Task<Contact> GetById(int id)
        {
            return _context.Contacts.FirstOrDefault(c=>c.Id==id);
        }
        public async Task<int> Create(Contact contact)
        {
            _context.Contacts.Add(contact);
            return await _context.SaveChangesAsync();
        }
        public async Task<int> Update(Contact contact)
        {
            _context.Contacts.Update(contact);
            return await _context.SaveChangesAsync();
        }
        public async Task<bool> Delete(int id)
        {
            var contact = await GetById(id);
            if (contact != null) 
            {
                _context.Contacts.Remove(contact);
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }
}
