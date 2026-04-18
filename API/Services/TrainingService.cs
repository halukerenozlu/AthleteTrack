using API.Data;
using API.Models.Entities;
using API.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class TrainingService
    {
        private readonly AppDbContext _context;

        public TrainingService(AppDbContext context)
        {
            _context = context;
        }

        // Translated comment.
        public async Task<Training?> CreateTrainingAsync(CreateTrainingDto model)
        {
            // Translated comment.
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Translated comment.
                var training = new Training
                {
                    Date = model.Date,
                    DurationMinutes = model.DurationMinutes,
                    Notes = model.Notes,
                    TeamId = model.TeamId,
                    TrainingTypeId = model.TrainingTypeId,
                    CreatedAt = DateTime.Now
                };

                _context.Trainings.Add(training);
                await _context.SaveChangesAsync(); // Translated comment.

                // Translated comment.
                var athletes = await _context.Athletes
                    .Where(a => a.TeamId == model.TeamId)
                    .ToListAsync();
                
                foreach (var athlete in athletes)
                {
                    _context.TrainingAttendances.Add(new TrainingAttendance
                    {
                        TrainingId = training.Id,
                        AthleteId = athlete.Id,
                        IsPresent = true, // Translated comment.
                        PerformanceRating = null
                    });
                }
                
                await _context.SaveChangesAsync(); // Translated comment.
                await transaction.CommitAsync();   // Translated comment.

                Console.WriteLine($"[BAŞARILI] Antrenman {training.Id} oluşturuldu.");
                return training;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(); // Translated comment.
                Console.WriteLine($"[HATA] Antrenman kaydedilemedi: {ex.Message}");
                // Translated comment.
                if (ex.InnerException != null) 
                    Console.WriteLine($"[DETAY] {ex.InnerException.Message}");
                
                throw; // Translated comment.
            }
        }

        // Translated comment.
        public async Task<List<TrainingResponseDto>> GetTrainingsByCoachAsync(int coachId)
        {
            var trainings = await _context.Trainings
                .Include(t => t.Team)
                .Include(t => t.TrainingType)
                .Include(t => t.TrainingAttendances)
                // Translated comment.
                .Where(t => t.Team!.CoachId == coachId) 
                .OrderByDescending(t => t.Date)
                .ToListAsync();

            return trainings.Select(t => new TrainingResponseDto
            {
                Id = t.Id,
                Date = t.Date,
                DurationMinutes = t.DurationMinutes,
                Notes = t.Notes,
                // Translated comment.
                TeamName = t.Team?.Name ?? "Bilinmiyor",
                TypeName = t.TrainingType?.Name ?? "-",
                ColorCode = t.TrainingType?.ColorCode ?? "#333",
                ParticipantCount = t.TrainingAttendances.Count(a => a.IsPresent) 
            }).ToList();
        }

        // Translated comment.
        public async Task<List<AttendanceDto>> GetAttendanceAsync(int trainingId)
        {
            var attendanceList = await _context.TrainingAttendances
                .Include(ta => ta.Athlete)
                .Where(ta => ta.TrainingId == trainingId)
                .ToListAsync();

            return attendanceList.Select(ta => new AttendanceDto
            {
                AthleteId = ta.AthleteId,
                // Translated comment.
                AthleteName = $"{ta.Athlete!.FirstName} {ta.Athlete.LastName}",
                IsPresent = ta.IsPresent,
                PerformanceRating = ta.PerformanceRating
            }).ToList();
        }

        // Translated comment.
        public async Task<bool> SaveAttendanceAsync(SaveAttendanceDto model)
        {
            foreach (var item in model.Attendances)
            {
                var attendance = await _context.TrainingAttendances
                    .FirstOrDefaultAsync(ta => ta.TrainingId == model.TrainingId && ta.AthleteId == item.AthleteId);

                if (attendance != null)
                {
                    attendance.IsPresent = item.IsPresent;
                    attendance.PerformanceRating = item.PerformanceRating;
                }
            }
            await _context.SaveChangesAsync();
            return true;
        }
        
        // Translated comment.
        public async Task<bool> DeleteTrainingAsync(int id)
        {
            // Translated comment.
            var training = await _context.Trainings
                .Include(t => t.TrainingAttendances) // Translated comment.
                .FirstOrDefaultAsync(t => t.Id == id);

            if (training == null) return false;
            
            // Translated comment.
            if (training.TrainingAttendances.Any())
            {
                _context.TrainingAttendances.RemoveRange(training.TrainingAttendances);
            }
            
            // Translated comment.
            _context.Trainings.Remove(training);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}