using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository;
using Service;
using Service.DTO.Request;
using Service.DTO.Response;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GustoSystemProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly ILogger<NotificationController> _logger;
        private readonly NotificationService _service;

        public NotificationController(ILogger<NotificationController> logger, NotificationService service)
        {
            _logger = logger;
            _service = service;
        }

        // GET: api/<NotificationController>
        [HttpGet]
        [Authorize]
        public async Task<List<NotificationResponse>> Get()
        {
            try
            {
                return await _service.GetAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting notifications");
                throw;
            }
        }
        // GET api/<NotificationController>/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<NotificationResponse> Get(int id)
        {
            try
            {
                return await _service.GetById(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while getting notification with id {id}");
                throw;
            }
        }

        [HttpGet("accountId")]
        [Authorize]
        public async Task<List<NotificationResponse>> GetByAccount([FromQuery] short accountId)
        {
            try
            {
                return await _service.GetByAccountId(accountId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while getting notification with id {accountId}");
                throw;
            }
        }


        // POST api/<NotificationController>
        //[HttpPost]
        //public NotificationResponse Post([FromBody] string value)
        //{

        //}

        // PUT api/<NotificationController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        // DELETE api/<NotificationController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}

        //Send Email
        [HttpPost("send-email")]
        public async Task<IActionResult> SendEmail([FromBody] SendEmailRequest request)
        {
            try
            {
                await _service.SendEmailAsync(request);
                return Ok(new { Message = "Email sent successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while sending email");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
