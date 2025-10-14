using Microsoft.AspNetCore.Mvc;
using Repository.Models;
using Service;
using Service.DTO.Request;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentMerchantController : ControllerBase
    {
        private readonly PaymentMerchantService service;
        public PaymentMerchantController(PaymentMerchantService service) => this.service = service;
        // GET: api/<PaymentMerchantController>
        [HttpGet]
        public async Task<List<PaymentMerchant>> Get()
        {
            return await service.GetAllAsync();
        }

        // GET api/<PaymentMerchantController>/5
        [HttpGet("{id}")]
        public async Task<PaymentMerchant> Get([FromRoute]short id)
        {
            return await service.GetByIdAsync(id);
        }
        [HttpGet("getByMe")]
        public async Task<PaymentMerchant> GetByMe()
        {
            var accountId = User.FindFirst("AccountID")?.Value;
            return await service.GetByMeAsync(short.Parse(accountId));
        }

        // POST api/<PaymentMerchantController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddPaymentMerchantRequest request)
        {
            var id = User.FindFirst("AccountID")?.Value;

            if (id == null)
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });
            request.AccountId = short.Parse(id);
            var result = await service.Create(request);
            return Ok(result);
        }

        // PUT api/<PaymentMerchantController>/5
        [HttpPut("{id}")]
        public async Task<int> Put([FromRoute]short id)
        {
            var accountId = User?.FindFirst("AccountID")?.Value;
            return await service.Update(id, short.Parse(accountId));
        }

        // DELETE api/<PaymentMerchantController>/5
        [HttpDelete("{id}")]
        public async Task<bool> Delete([FromRoute]short id)
        {
            var accountId = User?.FindFirst("AccountID")?.Value;
            return await service.Delete(id, short.Parse(accountId));
        }
    }
}
