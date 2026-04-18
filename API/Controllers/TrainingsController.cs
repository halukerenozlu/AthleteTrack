using API.Models.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // ToListAsync için gerekli

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainingsController : ControllerBase
    {
        private readonly TrainingService _trainingService;
        // Dropdown verisi için Context'i direkt burada kullanıyoruz (Pratik çözüm)
        private readonly API.Data.AppDbContext _context; 

        public TrainingsController(TrainingService trainingService, API.Data.AppDbContext context)
        {
            _trainingService = trainingService;
            _context = context;
        }

        // 1. Antrenman Tiplerini Getir (Dropdown İçin Kritik!)
        [HttpGet("types")]
        public async Task<IActionResult> GetTypes()
        {
            var types = await _context.TrainingTypes.ToListAsync();
            return Ok(types);
        }

        // 2. Hocanın Antrenmanlarını Getir
        [HttpGet("coach/{coachId}")]
        public async Task<IActionResult> GetByCoach(int coachId)
        {
            var list = await _trainingService.GetTrainingsByCoachAsync(coachId);
            return Ok(list);
        }

        // 3. Yeni Antrenman Ekle
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTrainingDto model)
        {
            await _trainingService.CreateTrainingAsync(model);
            return Ok(new { message = "Antrenman planlandı." });
        }

        // 4. Antrenman Sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await _trainingService.DeleteTrainingAsync(id);
            if (!res) return NotFound();
            return Ok(new { message = "Antrenman silindi." });
        }

        // 5. Yoklama Listesini Getir
        [HttpGet("attendance/{trainingId}")]
        public async Task<IActionResult> GetAttendance(int trainingId)
        {
            var list = await _trainingService.GetAttendanceAsync(trainingId);
            return Ok(list);
        }

        // 6. Yoklamayı Kaydet
        [HttpPost("attendance")]
        public async Task<IActionResult> SaveAttendance([FromBody] SaveAttendanceDto model)
        {
            await _trainingService.SaveAttendanceAsync(model);
            return Ok(new { message = "Yoklama kaydedildi." });
        }
    }
}