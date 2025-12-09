using API.Data;
using API.Models.Entities;
using API.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class InjuryService
    {
        private readonly AppDbContext _context;

        public InjuryService(AppDbContext context)
        {
            _context = context;
        }

        // 1. Hocanın Tüm Sakatlıklarını Getir (Aktif/Pasif Hepsi)
        public async Task<List<InjuryResponseDto>> GetInjuriesByCoachAsync(int coachId)
        {
            var injuries = await _context.Injuries
                .Include(i => i.InjuryType)
                .Include(i => i.Athlete)
                .ThenInclude(a => a!.Team) // Sporcunun takımı
                .Where(i => i.Athlete!.Team!.CoachId == coachId) // Sadece bu hocanın sporcuları
                .OrderByDescending(i => i.InjuryDate)
                .ToListAsync();

            return injuries.Select(i => new InjuryResponseDto
            {
                Id = i.Id,
                AthleteName = $"{i.Athlete!.FirstName} {i.Athlete.LastName}",
                TeamName = i.Athlete.Team?.Name ?? "-",
                AthleteImage = i.Athlete.ProfileImage,
                InjuryTypeName = i.InjuryType?.Name ?? "-",
                InjuryDate = i.InjuryDate,
                ExpectedReturnDate = i.ExpectedReturnDate,
                IsActive = i.IsActive,
                Notes = i.Notes
            }).ToList();
        }

        // 2. Yeni Sakatlık Ekle
        public async Task<Injury> CreateInjuryAsync(CreateInjuryDto model)
        {
            var injury = new Injury
            {
                AthleteId = model.AthleteId,
                InjuryTypeId = model.InjuryTypeId,
                InjuryDate = model.InjuryDate,
                ExpectedReturnDate = model.ExpectedReturnDate,
                Notes = model.Notes,
                IsActive = true // Yeni eklenen sakatlık aktiftir
            };

            _context.Injuries.Add(injury);
            await _context.SaveChangesAsync();
            return injury;
        }

        // 3. İyileşti Olarak İşaretle (Durum Güncelle)
        public async Task<bool> ToggleStatusAsync(int id)
        {
            var injury = await _context.Injuries.FindAsync(id);
            if (injury == null) return false;

            injury.IsActive = !injury.IsActive; // Tersine çevir (Aktif <-> Pasif)
            await _context.SaveChangesAsync();
            return true;
        }

        // 4. Sil
        public async Task<bool> DeleteInjuryAsync(int id)
        {
            var injury = await _context.Injuries.FindAsync(id);
            if (injury == null) return false;

            _context.Injuries.Remove(injury);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}