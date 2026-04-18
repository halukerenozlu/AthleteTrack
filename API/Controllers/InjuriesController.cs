using API.Models.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InjuriesController : ControllerBase
    {
        private readonly InjuryService _injuryService;
        private readonly API.Data.AppDbContext _context; // Translated comment.

        public InjuriesController(InjuryService injuryService, API.Data.AppDbContext context)
        {
            _injuryService = injuryService;
            _context = context;
        }

        // Translated comment.
        [HttpGet("coach/{coachId}")]
        public async Task<IActionResult> GetByCoach(int coachId)
        {
            var list = await _injuryService.GetInjuriesByCoachAsync(coachId);
            return Ok(list);
        }

        // Translated comment.
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateInjuryDto model)
        {
            await _injuryService.CreateInjuryAsync(model);
            return Ok(new { message = "Sakatlık kaydedildi." });
        }

        // Translated comment.
        [HttpPut("status/{id}")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var res = await _injuryService.ToggleStatusAsync(id);
            if (!res) return NotFound();
            return Ok(new { message = "Durum güncellendi." });
        }

        // Translated comment.
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await _injuryService.DeleteInjuryAsync(id);
            if (!res) return NotFound();
            return Ok(new { message = "Kayıt silindi." });
        }

        // Translated comment.
        [HttpGet("types")]
        public async Task<IActionResult> GetTypes()
        {
            var types = await _context.InjuryTypes.ToListAsync();
            return Ok(types);
        }
    }
}