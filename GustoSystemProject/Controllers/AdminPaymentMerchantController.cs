using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace GustoSystemProject.Controllers
{
   
    [Route("api/admin/[controller]")]
    [ApiController]
    
    public class AdminPaymentMerchantController : ControllerBase
    {
        private readonly PaymentMerchantService _service;

        public AdminPaymentMerchantController(PaymentMerchantService service)
        {
            _service = service;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAllPaymentInfos()
        {
            var result = await _service.GetAllAsync();

      
            var response = result.Select(x => new
            {
                PaymentId = x.Id,
                RestaurantName = x.Account?.FullName ?? "N/A", 
                BankName = x.Bank,
                AccountNumber = x.BankNo,
                OwnerName = x.BankAccountName,
                AccountId = x.AccountId
            });

            return Ok(response);
        }

      
        [HttpGet("get-by-restaurant/{restaurantId}")]
        public async Task<IActionResult> GetByRestaurantId(short restaurantId)
        {
         
            var result = await _service.GetByMeAsync(restaurantId);

            if (result == null)
            {
                return NotFound(new { message = "Nhà hàng này chưa cập nhật thông tin tài khoản ngân hàng." });
            }

            return Ok(new
            {
                RestaurantId = result.AccountId,
                BankName = result.Bank,          
                BankNumber = result.BankNo,      
                AccountName = result.BankAccountName, 
                LastUpdate = result.UpdateAt
            });
        }
    }
}
