using Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RoleService
    {
        private readonly RoleRepository _roleRepository;
        public RoleService(RoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }
        //CRUD
        public async Task<List<Role>> GetAllRoles()
        {
            return await _roleRepository.GetAllRoles();
        }
        public async Task<Role> GetRoleById(int id)
        {
            return await _roleRepository.GetRoleById(id);
        }
        public async Task<Role> CreateRole(Role role)
        {
            return await _roleRepository.CreateRole(role);
        }
        public async Task<Role> UpdateRole(Role role)
        {
            return await _roleRepository.UpdateRole(role);
        }
        public async Task<bool> DeleteRole(int id)
        {
            return await _roleRepository.DeleteRole(id);
        }
        //END-CRUD
    }
}
