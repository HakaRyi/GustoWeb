using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly TransactionService _service;
        public TransactionController(TransactionService service)
        {
            _service = service;
        }
        // GET: api/<TransactionController>
        [HttpGet]
        public async Task<List<Transaction>> Get()
        {
            return await _service.GetAll();
        }

        // GET api/<TransactionController>/5
        [HttpGet("{id}")]
        public async Task<Transaction> GetById([FromRoute]short id)
        {
            return await _service.GetById(id);
        }

        // POST api/<TransactionController>
        [HttpPost]
        public async Task<int> Post([FromBody] Transaction transaction)
        {
            return await _service.Create(transaction);  
        }

        // PUT api/<TransactionController>/5
        [HttpPut("{id}")]
        public async Task<int> Put( [FromRoute] short id)
        {
            return await _service.Update(id);
        }

        // DELETE api/<TransactionController>/5
        [HttpDelete("{id}")]
        public async Task<bool> Delete(short id)
        {
            return await _service.Delete(id);
        }
    }
}
