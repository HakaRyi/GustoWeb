using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace GustoSystemProject.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")] 
    public class AdminTransactionController : ControllerBase
    {
        private readonly TransactionService _service;

        public AdminTransactionController(TransactionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAll();
            return Ok(result);
        }
    }
}
