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

        // --- 1. CREATE TRAINING (WITH SAFE TRANSACTION) ---
        public async Task<Training?> CreateTrainingAsync(CreateTrainingDto model)
        {
            // Start transaction: either all operations succeed or none do.
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // A. Create training
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
                await _context.SaveChangesAsync(); // Required to generate training ID

                // B. Create attendance list automatically
                var athletes = await _context.Athletes
                    .Where(a => a.TeamId == model.TeamId)
                    .ToListAsync();
                
                foreach (var athlete in athletes)
                {
                    _context.TrainingAttendances.Add(new TrainingAttendance
                    {
                        TrainingId = training.Id,
                        AthleteId = athlete.Id,
                        IsPresent = true, // Default: present
                        PerformanceRating = null
                    });
                }
                
                await _context.SaveChangesAsync(); // Save attendance records
                await transaction.CommitAsync();   // Commit when everything succeeds

                Console.WriteLine($"[SUCCESS] Training {training.Id} created.");
                return training;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(); // Roll back on error
                Console.WriteLine($"[ERROR] Failed to save training: {ex.Message}");
                // Log inner exception details if available:
                if (ex.InnerException != null) 
                    Console.WriteLine($"[DETAIL] {ex.InnerException.Message}");
                
                throw; // Rethrow so the controller can handle the error
            }
        }

        // --- 2. GET COACH TRAININGS ---
        public async Task<List<TrainingResponseDto>> GetTrainingsByCoachAsync(int coachId)
        {
            var trainings = await _context.Trainings
                .Include(t => t.Team)
                .Include(t => t.TrainingType)
                .Include(t => t.TrainingAttendances)
                // FIX: Added ! to suppress null reference warning
                .Where(t => t.Team!.CoachId == coachId) 
                .OrderByDescending(t => t.Date)
                .ToListAsync();

            return trainings.Select(t => new TrainingResponseDto
            {
                Id = t.Id,
                Date = t.Date,
                DurationMinutes = t.DurationMinutes,
                Notes = t.Notes,
                // FIX: Added null checks (? and !)
                TeamName = t.Team?.Name ?? "Bilinmiyor",
                TypeName = t.TrainingType?.Name ?? "-",
                ColorCode = t.TrainingType?.ColorCode ?? "#333",
                ParticipantCount = t.TrainingAttendances.Count(a => a.IsPresent) 
            }).ToList();
        }

        // --- 3. GET ATTENDANCE LIST ---
        public async Task<List<AttendanceDto>> GetAttendanceAsync(int trainingId)
        {
            var attendanceList = await _context.TrainingAttendances
                .Include(ta => ta.Athlete)
                .Where(ta => ta.TrainingId == trainingId)
                .ToListAsync();

            return attendanceList.Select(ta => new AttendanceDto
            {
                AthleteId = ta.AthleteId,
                // FIX: Null-safe name concatenation
                AthleteName = $"{ta.Athlete!.FirstName} {ta.Athlete.LastName}",
                IsPresent = ta.IsPresent,
                PerformanceRating = ta.PerformanceRating
            }).ToList();
        }

        // --- 4. SAVE ATTENDANCE ---
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
        
        // --- 5. DELETE TRAINING (ENHANCED) ---
        public async Task<bool> DeleteTrainingAsync(int id)
        {
            // Fetch training and its related attendance records
            var training = await _context.Trainings
                .Include(t => t.TrainingAttendances) // Include related data
                .FirstOrDefaultAsync(t => t.Id == id);

            if (training == null) return false;
            
            // Delete linked attendance records first (prevents restrict errors)
            if (training.TrainingAttendances.Any())
            {
                _context.TrainingAttendances.RemoveRange(training.TrainingAttendances);
            }
            
            // Then delete the training
            _context.Trainings.Remove(training);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
