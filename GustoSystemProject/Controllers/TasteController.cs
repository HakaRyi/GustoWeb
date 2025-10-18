using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Service;
using Service.DTO.Request;

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
        public async Task<List<Taste>> Get()
        {
            return await service.GetAllAsync();
        }
        [HttpGet("menu/{menuId}")]
        public async Task<List<Taste>> GetTasteByMenu([FromRoute] short menuId)
        {
            return await service.GetTasteByMenuAsync(menuId);
        }

        // GET api/<TasteController>/5
        [HttpGet("{id}")]
        public async Task<Taste> Get([FromRoute] short id)
        {
            return await service.GetByIdAsync(id);
        }

        // POST api/<TasteController>
        [HttpPost("{menuId}")]
        public async Task<int> Post([FromRoute] short menuId,TasteRequest taste)
        {
            return await service.Create(menuId, taste);
        }

        // PUT api/<TasteController>/5
        [HttpPut("{id}")]
        public async Task<int> Put([FromRoute]short id, TasteRequest request)
        {
            var accountId = User?.FindFirst("AccountID")?.Value;
            return await service.Update(id,short.Parse(accountId), request);
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
