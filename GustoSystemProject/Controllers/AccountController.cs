using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.ModelExtensions;
using Repository.Models;
using Service;
using Service.DTO.Request;
using Service.DTO.Request.AccountRequest;
using Service.DTO.Response;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AccountService _service;
        private readonly DinerProfileService _dinerProfileService;
        private readonly RestaurantProfileService _restaurantProfileService;
        private readonly ILogger<AccountController> _logger;

        public AccountController(AccountService service, ILogger<AccountController> logger, DinerProfileService dinerProfileService, RestaurantProfileService restaurantProfileService)
        {
            _service = service;
            _logger = logger;
            _dinerProfileService = dinerProfileService;
            _restaurantProfileService = restaurantProfileService;
        }
        //CRUD Operations:
        // GET: api/<AccountController>
        [HttpGet]
        [Authorize]
        public async Task<List<AccountResponse>> Get()
        {
            return await _service.GetAllAccountsAsync();
        }

        // GET api/<AccountController>/
        [HttpGet("{id}")]
        [Authorize]
        public async Task<AccountResponse> Get(short id)
        {
            return await _service.GetAccountByIdAsync(id);
        }

        // POST api/<AccountController>
        [HttpPost("signUp")]
        public async Task<AccountResponse> SignUp([FromBody] SignUpRequest value)
        {
            return await _service.CreateAccountAsync(value);
        }

        [HttpPost("signIn")]
        public async Task<bool> SignIn([FromBody] SignInRequest value)
        {
            return await _service.SignInAsync(value);
        }

        // PUT api/<AccountController>/5
        [HttpPut]
        [Authorize]
        public async Task<AccountResponse> Put([FromBody] UpdateAccountRequest value)
        {
            return await _service.UpdateAccountAsync(value);
        }

        // DELETE api/<AccountController>/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<bool> Delete(short id)
        {
            return await _service.DeleteAccountAsync(id);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["RefreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized("Missing refresh token");

            try
            {
                await _service.RefreshAccessToken(refreshToken);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Refresh token error");
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var result = await _service.SignOutAsync();
                if (result)
                {
                    return Ok(new { message = "Logged out successfully" });
                }
                else
                {
                    return BadRequest(new { message = "Logout failed" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Logout error");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("search")]
        [Authorize]
        public async Task<List<Account>> SearchAccount([FromQuery] string username, [FromQuery] int roleId, [FromQuery] string profileName)
        {
            try
            {
                return await _service.SearchAccount(username, roleId, profileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Search account error");
                return new List<Account>();

            }
        }

        [HttpPost("searchWithPagination")]
        [Authorize]
        public async Task<PaginationResult<List<Account>>> SearchAccountWithPagination([FromBody] AccountSearchRequest searchRequest)
        {
            try
            {
                return await _service.SearchAccountWithPaging(searchRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Search account with pagination error");
                return new PaginationResult<List<Account>>();
            }
        }

        [HttpGet("checkPhone")]
        public Task<bool> CheckPhoneNumber([FromQuery] string phoneNumber)
        {
            try
            {
                return _service.isPhoneExistAsync(phoneNumber);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Check phone number error");
                return Task.FromResult(false);
            }
        }

        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetProfileByIdAsync(short id)
        {
            var account = await _service.GetAccountByIdAsync(id);
            if(account == null)
            {
                return NotFound(new {message = "Tài khoản không tồn tại"});
            }
            var role = account.RoleId;
            if(role == 1)//Diner
            {
                var result = await _dinerProfileService.GetByIdAsync(id);
                return Ok(result);
            }
            else if (role == 2) //Restaurant
            {
                var result = await _restaurantProfileService.GetByIdAsync(id);
                return Ok(result);
            }
            else
            {
                return NotFound(new { message = "Không tìm thấy hồ sơ" });
            }
                
        }

        [HttpGet("get-me")]
        public async Task<IActionResult> GetMe()
        {
            var id = short.Parse(User.FindFirst("AccountID")?.Value);

            if (id == null)
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng trong token" });

            var account = await _service.GetAccountByIdAsync(id);
            if (account == null)
            {
                return NotFound(new { message = "Tài khoản không tồn tại" });
            }
            var role = account.RoleId;
            if (role == 1)//Diner
            {
                var result = await _dinerProfileService.GetByIdAsync(id);
                return Ok(result);
            }
            else if (role == 2) //Restaurant
            {
                var result = await _restaurantProfileService.GetByIdAsync(id);
                return Ok(result);
            }
            else
            {
                return NotFound(new { message = "Không tìm thấy hồ sơ" });
            }
        }
    }
}
