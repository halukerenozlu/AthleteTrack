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

        // 1. Fetch all injuries for the coach (active/inactive)
        public async Task<List<InjuryResponseDto>> GetInjuriesByCoachAsync(int coachId)
        {
            var injuries = await _context.Injuries
                .Include(i => i.InjuryType)
                .Include(i => i.Athlete)
                .ThenInclude(a => a!.Team) // Athlete team
                .Where(i => i.Athlete!.Team!.CoachId == coachId) // Only this coach's athletes
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

        // 2. Create new injury
        public async Task<Injury> CreateInjuryAsync(CreateInjuryDto model)
        {
            var injury = new Injury
            {
                AthleteId = model.AthleteId,
                InjuryTypeId = model.InjuryTypeId,
                InjuryDate = model.InjuryDate,
                ExpectedReturnDate = model.ExpectedReturnDate,
                Notes = model.Notes,
                IsActive = true // Newly created injury is active
            };

            _context.Injuries.Add(injury);
            await _context.SaveChangesAsync();
            return injury;
        }

        // 3. Mark as recovered (status toggle)
        public async Task<bool> ToggleStatusAsync(int id)
        {
            var injury = await _context.Injuries.FindAsync(id);
            if (injury == null) return false;

            injury.IsActive = !injury.IsActive; // Toggle (Active <-> Inactive)
            await _context.SaveChangesAsync();
            return true;
        }

        // 4. Delete
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
