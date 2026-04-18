using API.Models.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AthletesController : ControllerBase
    {
        private readonly AthleteService _athleteService;

        public AthletesController(AthleteService athleteService)
        {
            _athleteService = athleteService;
        }

        // --- NEWLY ADDED: Fetch all athletes (for Athletes Page) ---
        [HttpGet("coach/{coachId}")]
        public async Task<IActionResult> GetAllByCoach(int coachId)
        {
            var athletes = await _athleteService.GetAthletesByCoachAsync(coachId);
            return Ok(athletes);
        }

        // --- EXISTING: For Team Details Page ---
        [HttpGet("team/{teamId}")]
        public async Task<IActionResult> GetByTeam(int teamId)
        {
            var athletes = await _athleteService.GetAthletesByTeamAsync(teamId);
            return Ok(athletes);
        }

        // --- CREATE ATHLETE ---
        [HttpPost]
        public async Task<IActionResult> AddAthlete([FromBody] CreateAthleteDto model)
        {
            var createdAthlete = await _athleteService.AddAthleteAsync(model);
            return Ok(new { message = "Sporcu eklendi.", id = createdAthlete.Id });
        }

        // --- DELETE ATHLETE ---
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAthlete(int id)
        {
            var result = await _athleteService.DeleteAthleteAsync(id);
            if (!result) return NotFound("Sporcu bulunamadı.");
            return Ok(new { message = "Sporcu silindi." });
        }

        // --- PHOTO UPLOAD ---
        [HttpPost("upload-photo/{id}")]
        public async Task<IActionResult> UploadPhoto(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Dosya seçilmedi." });

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                await _athleteService.UpdateAthleteImageAsync(id, memoryStream.ToArray());
            }
            return Ok(new { message = "Fotoğraf güncellendi." });
        }

        // --- FETCH PHOTO ---
        [HttpGet("image/{id}")]
        public async Task<IActionResult> GetImage(int id)
        {
            var imageBytes = await _athleteService.GetAthleteImageAsync(id);
            if (imageBytes == null) return NotFound();
            return File(imageBytes, "image/jpeg");
        }

        // PUT: api/athletes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAthlete(int id, [FromBody] CreateAthleteDto model)
        {
            var result = await _athleteService.UpdateAthleteAsync(id, model);
            if (!result) return NotFound("Sporcu bulunamadı.");

            return Ok(new { message = "Sporcu bilgileri güncellendi." });
        }
    }
}
