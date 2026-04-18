using API.Models.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Translated comment.

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainingsController : ControllerBase
    {
        private readonly TrainingService _trainingService;
        // Translated comment.
        private readonly API.Data.AppDbContext _context; 

        public TrainingsController(TrainingService trainingService, API.Data.AppDbContext context)
        {
            _trainingService = trainingService;
            _context = context;
        }

        // Translated comment.
        [HttpGet("types")]
        public async Task<IActionResult> GetTypes()
        {
            var types = await _context.TrainingTypes.ToListAsync();
            return Ok(types);
        }

        // Translated comment.
        [HttpGet("coach/{coachId}")]
        public async Task<IActionResult> GetByCoach(int coachId)
        {
            var list = await _trainingService.GetTrainingsByCoachAsync(coachId);
            return Ok(list);
        }

        // Translated comment.
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTrainingDto model)
        {
            await _trainingService.CreateTrainingAsync(model);
            return Ok(new { message = "Antrenman planlandı." });
        }

        // Translated comment.
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await _trainingService.DeleteTrainingAsync(id);
            if (!res) return NotFound();
            return Ok(new { message = "Antrenman silindi." });
        }

        // Translated comment.
        [HttpGet("attendance/{trainingId}")]
        public async Task<IActionResult> GetAttendance(int trainingId)
        {
            var list = await _trainingService.GetAttendanceAsync(trainingId);
            return Ok(list);
        }

        // Translated comment.
        [HttpPost("attendance")]
        public async Task<IActionResult> SaveAttendance([FromBody] SaveAttendanceDto model)
        {
            await _trainingService.SaveAttendanceAsync(model);
            return Ok(new { message = "Yoklama kaydedildi." });
        }
    }
}
