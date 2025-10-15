using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly ContactService _contactService;
        public ContactController(ContactService contactService)
        {
            this._contactService = contactService;
        }
        // GET: api/<ContactController>
        [HttpGet]
        public async Task<List<Contact>> Get()
        {
            return await _contactService.GetAll();
        }

        // GET api/<ContactController>/5
        [HttpGet("{id}")]
        public async Task<Contact> GetById([FromRoute]int id)
        {
            return await _contactService.GetById(id);
        }

        // POST api/<ContactController>
        [HttpPost]
        public async Task<int> Post([FromBody] Contact contact)
        {
            return await _contactService.Create(contact);
        }

        // PUT api/<ContactController>/5
        [HttpPut("{id}")]
        public async Task<int> Put([FromRoute]int id)
        {
            return await _contactService.Update(id);  
        }

        // DELETE api/<ContactController>/5
        [HttpDelete("{id}")]
        public async Task<bool> Delete(int id)
        {
            return await _contactService.Delete(id);
        }
    }
}
