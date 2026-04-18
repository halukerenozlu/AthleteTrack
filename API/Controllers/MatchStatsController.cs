using API.Models.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchStatsController : ControllerBase
    {
        private readonly MatchStatService _statService;

        public MatchStatsController(MatchStatService statService)
        {
            _statService = statService;
        }

        // GET: api/matchstats/match/5
        [HttpGet("match/{matchId}")]
        public async Task<IActionResult> GetByMatch(int matchId)
        {
            var list = await _statService.GetStatsByMatchAsync(matchId);
            return Ok(list);
        }

        // POST: api/matchstats
        [HttpPost]
        public async Task<IActionResult> Save([FromBody] CreateMatchStatDto model)
        {
            var result = await _statService.SaveStatsAsync(model);
            if (!result) return BadRequest("Kaydedilemedi.");
            return Ok(new { message = "İstatistikler güncellendi." });
        }
    }
}