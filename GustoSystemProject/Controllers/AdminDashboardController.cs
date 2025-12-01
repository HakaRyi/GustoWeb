using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace GustoSystemProject.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly DashboardService _service;

        public AdminDashboardController(DashboardService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardData()
        {
            var data = await _service.GetAdminDashboardAsync();
            return Ok(data);
        }
    }
}
