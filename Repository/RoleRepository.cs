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
    public class RoleRepository
    {
        private readonly GustoSystemContext _context;

        public RoleRepository(GustoSystemContext context)
        {
            _context = context;
        }

        //CRUD
        public async Task<List<Role>> GetAllRoles()
        {
            return await _context.Roles.ToListAsync();
        }

        public async Task<Role> GetRoleById(int id)
        {
            return await _context.Roles.FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Role> CreateRole(Role role)
        {
            var process = await _context.Roles.AddAsync(role);
            await _context.SaveChangesAsync();
            return process.Entity;
        }

        public async Task<Role> UpdateRole(Role role)
        {
            var process = _context.Roles.Update(role);
            await _context.SaveChangesAsync();
            return process.Entity;
        }
        public async Task<bool> DeleteRole(int id)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == id);
            if (role == null)
            {
                return false;
            }
            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
            return true;
        }
        //END-CRUD

    }
}
