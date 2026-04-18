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

        // --- 1. ANTRENMAN EKLE (GÜVENLİ TRANSACTION İLE) ---
        public async Task<Training?> CreateTrainingAsync(CreateTrainingDto model)
        {
            // Transaction başlatıyoruz: Ya hepsi kaydolur ya hiçbiri.
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // A. Antrenmanı Oluştur
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
                await _context.SaveChangesAsync(); // ID oluşması için kayıt şart

                // B. Yoklama Listesini Oluştur (Otomatik)
                var athletes = await _context.Athletes
                    .Where(a => a.TeamId == model.TeamId)
                    .ToListAsync();
                
                foreach (var athlete in athletes)
                {
                    _context.TrainingAttendances.Add(new TrainingAttendance
                    {
                        TrainingId = training.Id,
                        AthleteId = athlete.Id,
                        IsPresent = true, // Varsayılan: Geldi
                        PerformanceRating = null
                    });
                }
                
                await _context.SaveChangesAsync(); // Yoklamaları kaydet
                await transaction.CommitAsync();   // Her şey yolundaysa onayla

                Console.WriteLine($"[BAŞARILI] Antrenman {training.Id} oluşturuldu.");
                return training;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(); // Hata varsa işlemi geri al
                Console.WriteLine($"[HATA] Antrenman kaydedilemedi: {ex.Message}");
                // Detaylı hatayı görmek için:
                if (ex.InnerException != null) 
                    Console.WriteLine($"[DETAY] {ex.InnerException.Message}");
                
                throw; // Hatayı Controller'a fırlat ki Frontend anlasın
            }
        }

        // --- 2. HOCANIN ANTRENMANLARINI GETİR ---
        public async Task<List<TrainingResponseDto>> GetTrainingsByCoachAsync(int coachId)
        {
            var trainings = await _context.Trainings
                .Include(t => t.Team)
                .Include(t => t.TrainingType)
                .Include(t => t.TrainingAttendances)
                // DÜZELTME: Null referans uyarısı için ! işareti eklendi
                .Where(t => t.Team!.CoachId == coachId) 
                .OrderByDescending(t => t.Date)
                .ToListAsync();

            return trainings.Select(t => new TrainingResponseDto
            {
                Id = t.Id,
                Date = t.Date,
                DurationMinutes = t.DurationMinutes,
                Notes = t.Notes,
                // DÜZELTME: Null kontrolleri (? ve !) eklendi
                TeamName = t.Team?.Name ?? "Bilinmiyor",
                TypeName = t.TrainingType?.Name ?? "-",
                ColorCode = t.TrainingType?.ColorCode ?? "#333",
                ParticipantCount = t.TrainingAttendances.Count(a => a.IsPresent) 
            }).ToList();
        }

        // --- 3. YOKLAMA LİSTESİNİ GETİR ---
        public async Task<List<AttendanceDto>> GetAttendanceAsync(int trainingId)
        {
            var attendanceList = await _context.TrainingAttendances
                .Include(ta => ta.Athlete)
                .Where(ta => ta.TrainingId == trainingId)
                .ToListAsync();

            return attendanceList.Select(ta => new AttendanceDto
            {
                AthleteId = ta.AthleteId,
                // DÜZELTME: İsim birleştirirken null kontrolü
                AthleteName = $"{ta.Athlete!.FirstName} {ta.Athlete.LastName}",
                IsPresent = ta.IsPresent,
                PerformanceRating = ta.PerformanceRating
            }).ToList();
        }

        // --- 4. YOKLAMAYI KAYDET ---
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
        
        // --- 5. ANTRENMAN SİL (GÜÇLENDİRİLMİŞ) ---
        public async Task<bool> DeleteTrainingAsync(int id)
        {
            // Antrenmanı ve ona bağlı yoklamaları getir
            var training = await _context.Trainings
                .Include(t => t.TrainingAttendances) // İlişkili veriyi dahil et
                .FirstOrDefaultAsync(t => t.Id == id);

            if (training == null) return false;
            
            // Önce bağlı olan yoklama kayıtlarını sil (Restrict hatasını önler)
            if (training.TrainingAttendances.Any())
            {
                _context.TrainingAttendances.RemoveRange(training.TrainingAttendances);
            }
            
            // Sonra antrenmanı sil
            _context.Trainings.Remove(training);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}