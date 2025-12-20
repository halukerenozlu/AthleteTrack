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
            // Önce seçilen takımın hocasını bulalım
            var team = await _context.Teams.FindAsync(model.TeamId);
            if (team == null) throw new Exception("Takım bulunamadı");

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
                CoachId = (int)team.CoachId!, // <-- YENİ: Hocayı takımdan alıp kaydettik
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

        // 5. SPORCU SİL (GÜÇLENDİRİLMİŞ - Manuel Cascade)
        public async Task<bool> DeleteAthleteAsync(int id)
        {
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null) return false;

            // --- İLİŞKİLİ VERİLERİ TEMİZLE ---

            // A. Sakatlık kayıtlarını sil
            var injuries = _context.Injuries.Where(i => i.AthleteId == id);
            _context.Injuries.RemoveRange(injuries);

            // B. Yoklama kayıtlarını sil
            var attendances = _context.TrainingAttendances.Where(ta => ta.AthleteId == id);
            _context.TrainingAttendances.RemoveRange(attendances);

            // C. Maç İstatistiklerini sil
            var stats = _context.MatchStatistics.Where(ms => ms.AthleteId == id);
            _context.MatchStatistics.RemoveRange(stats);

            // ---------------------------------

            // Artık sporcu tertemiz, silebiliriz.
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
                // DEĞİŞEN KISIM: Artık direkt sporcunun hocasına bakıyoruz
                .Where(a => a.CoachId == coachId) 
                .OrderBy(a => a.Team != null ? a.Team.Name : "ZZZ") // Takımsızları sona at
                .ToListAsync();

            return athletes.Select(a => new AthleteResponseDto
            {
                Id = a.Id,
                FullName = $"{a.FirstName} {a.LastName}",
                JerseyNumber = a.JerseyNumber,
                Position = a.Position?.Name ?? "-",
                TeamName = a.Team?.Name ?? "Takımsız",
                HasImage = a.ProfileImage != null && a.ProfileImage.Length > 0,
                Age = DateTime.Now.Year - a.BirthDate.Year,
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

            // Takım değiştiyse, yeni takımın hocasını da güncellemek gerekebilir
            if (athlete.TeamId != model.TeamId)
            {
                 var newTeam = await _context.Teams.FindAsync(model.TeamId);
                 if (newTeam != null) athlete.CoachId = (int)newTeam.CoachId!;
            }
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