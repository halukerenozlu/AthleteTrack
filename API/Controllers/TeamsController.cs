using API.Models.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly TeamService _teamService;

        public TeamsController(TeamService teamService)
        {
            _teamService = teamService;
        }

        // GET: api/teams/coach/1 (fetch teams for coach #1)
        [HttpGet("coach/{coachId}")]
        public async Task<IActionResult> GetMyTeams(int coachId)
        {
            var teams = await _teamService.GetTeamsByCoachAsync(coachId);
            return Ok(teams);
        }

        // POST: api/teams (create a new team)
        [HttpPost]
        public async Task<IActionResult> AddTeam([FromBody] CreateTeamDto model)
        {
            if (string.IsNullOrEmpty(model.Name))
                return BadRequest(new { message = "Takım adı boş olamaz." });

            await _teamService.AddTeamAsync(model);
            return Ok(new { message = "Takım başarıyla oluşturuldu." });
        }

        // DELETE: api/teams/5 (delete team #5)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeam(int id)
        {
            var result = await _teamService.DeleteTeamAsync(id);
            if (!result) return NotFound("Takım bulunamadı.");

            return Ok(new { message = "Takım silindi." });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeam(int id, [FromBody] CreateTeamDto model)
        {
            var result = await _teamService.UpdateTeamAsync(id, model);
            if (!result) return NotFound("Takım bulunamadı.");

            return Ok(new { message = "Takım güncellendi." });
        }

    }
}
