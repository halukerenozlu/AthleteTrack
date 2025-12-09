using API.Models.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchesController : ControllerBase
    {
        private readonly MatchService _matchService;

        public MatchesController(MatchService matchService)
        {
            _matchService = matchService;
        }

        [HttpGet("coach/{coachId}")]
        public async Task<IActionResult> GetByCoach(int coachId)
        {
            var list = await _matchService.GetMatchesByCoachAsync(coachId);
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMatchDto model)
        {
            await _matchService.CreateMatchAsync(model);
            return Ok(new { message = "Maç fikstüre eklendi." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await _matchService.DeleteMatchAsync(id);
            if (!res) return NotFound();
            return Ok(new { message = "Maç silindi." });
        }
    }
}