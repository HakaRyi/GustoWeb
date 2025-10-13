using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasteController : ControllerBase
    {
        private readonly TasteService service;
        public TasteController(TasteService service)
        {
            this.service = service;
        }
        // GET: api/<TasteController>
        [HttpGet]
        public async Task<List<Taste>>Get()
        {
            return await service.GetAllAsync();
        }

        // GET api/<TasteController>/5
        [HttpGet("{id}")]
        public async Task<Taste> Get([FromRoute]short id)
        {
            return await service.GetByIdAsync(id);
        }

        // POST api/<TasteController>
        [HttpPost]
        public async Task<int> Post(Taste taste)
        {
            return await service.Create(taste);
        }

        // PUT api/<TasteController>/5
        [HttpPut("{id}")]
        public async Task<int> Put([FromRoute]short id)
        {
            var accountId = User?.FindFirst("AccountID")?.Value;
            return await service.Update(id,short.Parse(accountId));
        }

        // DELETE api/<TasteController>/5
        [HttpDelete("{id}")]
        public async Task<bool> Delete([FromRoute]short id)
        {
            var accountId = User?.FindFirst("AccountID")?.Value;
            return await service.Delete(id, short.Parse(accountId));
        }
    }
}
