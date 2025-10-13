using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OptionalController : ControllerBase
    {
        private readonly OptionalService service;
        public OptionalController(OptionalService service)
        {
            this.service = service;
        }

        // GET: api/<OptionalController>
        [HttpGet]
        public async Task<List<Optional>> Get()
        {
            return await service.GetAllAsync();
        }

  
        [HttpGet("{id}")]
        public async Task<Optional> Get([FromRoute] short id)
        {
            return await service.GetByIdAsync(id);
        }

        [HttpPost]
        public async Task<int> Post(Optional opt)
        {
            return await service.Create(opt);
        }

        [HttpPut("{id}")]
        public async Task<int> Put([FromRoute] short id)
        {
            var accountId = User?.FindFirst("AccountID")?.Value;
            return await service.Update(id, short.Parse(accountId));
        }

        [HttpDelete("{id}")]
        public async Task<bool> Delete([FromRoute] short id)
        {
            var accountId = User?.FindFirst("AccountID")?.Value;
            return await service.Delete(id, short.Parse(accountId));
        }
    }
}
