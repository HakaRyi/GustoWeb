using Microsoft.AspNetCore.Mvc;
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
        private readonly ILogger<AccountController> _logger;

        public AccountController(AccountService service, ILogger<AccountController> logger)
        {
            _service = service;
            _logger = logger;
        }
        //CRUD Operations:
        // GET: api/<AccountController>
        [HttpGet]
        public async Task<List<AccountResponse>> Get()
        {
            return await _service.GetAllAccountsAsync();
        }

        // GET api/<AccountController>/
        [HttpGet("{id}")]
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
        public async Task<AccountResponse> Put([FromBody] UpdateAccountRequest value)
        {
            return await _service.UpdateAccountAsync(value);
        }

        // DELETE api/<AccountController>/5
        [HttpDelete("{id}")]
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
    }
}
