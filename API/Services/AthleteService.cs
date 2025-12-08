using API.Data;
using API.Models.Entities;
using API.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class AthleteService
    {
        private readonly AppDbContext _context;

        public AthleteService(AppDbContext context)
        {
            _context = context;
        }

        // 1. Bir Takıma Ait Sporcuları Getir
        public async Task<List<AthleteResponseDto>> GetAthletesByTeamAsync(int teamId)
        {
            var athletes = await _context.Athletes
                .Where(a => a.TeamId == teamId)
                .Include(a => a.Position)
                .Include(a => a.Team)
                .ToListAsync();

            return athletes.Select(a => new AthleteResponseDto
            {
                Id = a.Id,
                FullName = $"{a.FirstName} {a.LastName}",
                JerseyNumber = a.JerseyNumber,
                Position = a.Position?.Name ?? "-",
                TeamName = a.Team?.Name ?? "-",
                HasImage = a.ProfileImage != null && a.ProfileImage.Length > 0,
                Age = DateTime.Now.Year - a.BirthDate.Year,
                
                // --- EKSİKLER EKLENDİ ---
                Height = a.Height,
                Weight = a.Weight,
                Phone = a.Phone,
                BirthDate = a.BirthDate
            }).ToList();
        }

        // 2. Yeni Sporcu Ekle
        public async Task<Athlete> AddAthleteAsync(CreateAthleteDto model)
        {
            var newAthlete = new Athlete
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                JerseyNumber = model.JerseyNumber,
                Height = model.Height,
                Weight = model.Weight,
                Phone = model.Phone,
                BirthDate = model.BirthDate,
                TeamId = model.TeamId,
                PositionId = model.PositionId,
                CreatedAt = DateTime.Now
            };

            _context.Athletes.Add(newAthlete);
            await _context.SaveChangesAsync();
            return newAthlete;
        }

        // 3. Fotoğraf Yükle (Sporcu İçin)
        public async Task<bool> UpdateAthleteImageAsync(int athleteId, byte[] imageBytes)
        {
            var athlete = await _context.Athletes.FindAsync(athleteId);
            if (athlete == null) return false;

            athlete.ProfileImage = imageBytes;
            await _context.SaveChangesAsync();
            return true;
        }
        
        // 4. Fotoğrafı Getir
        public async Task<byte[]?> GetAthleteImageAsync(int athleteId)
        {
            var athlete = await _context.Athletes.FindAsync(athleteId);
            return athlete?.ProfileImage;
        }

        // 5. Sporcu Sil
        public async Task<bool> DeleteAthleteAsync(int id)
        {
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null) return false;

            _context.Athletes.Remove(athlete);
            await _context.SaveChangesAsync();
            return true;
        }
        // HOCANIN TÜM SPORCULARINI GETİR (Tüm takımlardan)
       public async Task<List<AthleteResponseDto>> GetAthletesByCoachAsync(int coachId)
        {
            var athletes = await _context.Athletes
                .Include(a => a.Team)
                .Include(a => a.Position)
                .Where(a => a.Team!.CoachId == coachId) // Ünlem işareti doğru (Null uyarısını susturur)
                .OrderBy(a => a.Team!.Name)
                .ToListAsync();

            return athletes.Select(a => new AthleteResponseDto
            {
                Id = a.Id,
                FullName = $"{a.FirstName} {a.LastName}",
                JerseyNumber = a.JerseyNumber,
                Position = a.Position?.Name ?? "-",
                TeamName = a.Team?.Name ?? "-",
                HasImage = a.ProfileImage != null && a.ProfileImage.Length > 0,
                Age = DateTime.Now.Year - a.BirthDate.Year,
                
                // --- EKSİKLER EKLENDİ ---
                Height = a.Height,
                Weight = a.Weight,
                Phone = a.Phone,
                BirthDate = a.BirthDate
            }).ToList();
        }

        // 6. SPORCU GÜNCELLEME
        public async Task<bool> UpdateAthleteAsync(int id, CreateAthleteDto model)
        {
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null) return false;

            // Bilgileri güncelle
            athlete.FirstName = model.FirstName;
            athlete.LastName = model.LastName;
            athlete.JerseyNumber = model.JerseyNumber;
            athlete.Height = model.Height;
            athlete.Weight = model.Weight;
            athlete.Phone = model.Phone;
            athlete.BirthDate = model.BirthDate;
            athlete.TeamId = model.TeamId;
            athlete.PositionId = model.PositionId;

            // Takım ve Pozisyon değiştiyse ilişkileri güncellemek için Id'leri set ediyoruz
            // EF Core SaveChanges() ile bunu halledecek.

            await _context.SaveChangesAsync();
            return true;
        }
    }
}