using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository;
using Repository.Models;

namespace Service
{
    public class ContactService
    {
        private readonly ContactRepository contactRepository;
        public ContactService(ContactRepository contactRepository)
        {
            this.contactRepository = contactRepository;
        }
        public async Task<List<Contact>> GetAll()
        {
            try
            {
                return await contactRepository.GetAll();
            }
            catch (Exception ex)
            {
            }
            return new List<Contact>();
        }
        public async Task<Contact> GetById(int id)
        {
            try
            {
                return await contactRepository.GetById(id);
            }
            catch (Exception ex)
            {
            }
            return new Contact();
        }
        public async Task<int> Create(Contact contact)
        {
            try
            {
                return await contactRepository.Create(contact);
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<int> Update(int id)
        {
            try
            {
                var contact = await contactRepository.GetById(id);
                return await contactRepository.Update(contact);
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<bool> Delete(int id)
        {
            try
            {
                return await contactRepository.Delete(id);
            }
            catch (Exception ex)
            {
            }
            return false;
        }
    }
}
