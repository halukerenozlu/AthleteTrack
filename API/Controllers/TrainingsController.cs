using API.Models.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Required for ToListAsync

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainingsController : ControllerBase
    {
        private readonly TrainingService _trainingService;
        // Use DbContext directly here for dropdown data (practical approach).
        private readonly API.Data.AppDbContext _context; 

        public TrainingsController(TrainingService trainingService, API.Data.AppDbContext context)
        {
            _trainingService = trainingService;
            _context = context;
        }

        // 1. Fetch training types (required for dropdown)
        [HttpGet("types")]
        public async Task<IActionResult> GetTypes()
        {
            var types = await _context.TrainingTypes.ToListAsync();
            return Ok(types);
        }

        // 2. Fetch coach trainings
        [HttpGet("coach/{coachId}")]
        public async Task<IActionResult> GetByCoach(int coachId)
        {
            var list = await _trainingService.GetTrainingsByCoachAsync(coachId);
            return Ok(list);
        }

        // 3. Create a new training
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTrainingDto model)
        {
            await _trainingService.CreateTrainingAsync(model);
            return Ok(new { message = "Antrenman planlandı." });
        }

        // 4. Delete training
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await _trainingService.DeleteTrainingAsync(id);
            if (!res) return NotFound();
            return Ok(new { message = "Antrenman silindi." });
        }

        // 5. Get Attendance List
        [HttpGet("attendance/{trainingId}")]
        public async Task<IActionResult> GetAttendance(int trainingId)
        {
            var list = await _trainingService.GetAttendanceAsync(trainingId);
            return Ok(list);
        }

        // 6. Save Attendance
        [HttpPost("attendance")]
        public async Task<IActionResult> SaveAttendance([FromBody] SaveAttendanceDto model)
        {
            await _trainingService.SaveAttendanceAsync(model);
            return Ok(new { message = "Yoklama kaydedildi." });
        }
    }
}
