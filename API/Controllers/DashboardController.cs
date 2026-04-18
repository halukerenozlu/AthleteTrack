using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;

        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        // GET: api/dashboard/summary/1
        [HttpGet("summary/{coachId}")]
        public async Task<IActionResult> GetSummary(int coachId)
        {
            var summary = await _dashboardService.GetSummaryAsync(coachId);
            return Ok(summary);
        }
    }
}