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

        // 1. Fetch athletes for a team
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
                
                // --- ADDED MISSING FIELDS ---
                Height = a.Height,
                Weight = a.Weight,
                Phone = a.Phone,
                BirthDate = a.BirthDate
            }).ToList();
        }

        // 2. Add new athlete
        public async Task<Athlete> AddAthleteAsync(CreateAthleteDto model)
        {
            // First, find the coach of the selected team
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
                CoachId = (int)team.CoachId!, // <-- NEW: Set coach from selected team
                CreatedAt = DateTime.Now
            };

            _context.Athletes.Add(newAthlete);
            await _context.SaveChangesAsync();
            return newAthlete;
        }

        // 3. Upload athlete photo
        public async Task<bool> UpdateAthleteImageAsync(int athleteId, byte[] imageBytes)
        {
            var athlete = await _context.Athletes.FindAsync(athleteId);
            if (athlete == null) return false;

            athlete.ProfileImage = imageBytes;
            await _context.SaveChangesAsync();
            return true;
        }
        
        // 4. Fetch athlete photo
        public async Task<byte[]?> GetAthleteImageAsync(int athleteId)
        {
            var athlete = await _context.Athletes.FindAsync(athleteId);
            return athlete?.ProfileImage;
        }

        // 5. DELETE ATHLETE (ENHANCED - Manual cascade)
        public async Task<bool> DeleteAthleteAsync(int id)
        {
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null) return false;

            // --- CLEAN RELATED DATA ---

            // A. Delete injury records
            var injuries = _context.Injuries.Where(i => i.AthleteId == id);
            _context.Injuries.RemoveRange(injuries);

            // B. Delete attendance records
            var attendances = _context.TrainingAttendances.Where(ta => ta.AthleteId == id);
            _context.TrainingAttendances.RemoveRange(attendances);

            // C. Delete match statistics
            var stats = _context.MatchStatistics.Where(ms => ms.AthleteId == id);
            _context.MatchStatistics.RemoveRange(stats);

            // ---------------------------------

            // Athlete is now detached from related data and can be deleted.
            _context.Athletes.Remove(athlete);
            await _context.SaveChangesAsync();
            return true;
        }

        // GET ALL ATHLETES OF THE COACH (across all teams)
       public async Task<List<AthleteResponseDto>> GetAthletesByCoachAsync(int coachId)
        {
            var athletes = await _context.Athletes
                .Include(a => a.Team)
                .Include(a => a.Position)
                // UPDATED: Filter directly by athlete coach
                .Where(a => a.CoachId == coachId) 
                .OrderBy(a => a.Team != null ? a.Team.Name : "ZZZ") // Put unassigned athletes at the end
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

        // 6. UPDATE ATHLETE
        public async Task<bool> UpdateAthleteAsync(int id, CreateAthleteDto model)
        {
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null) return false;

            // If team changes, update coach based on the new team
            if (athlete.TeamId != model.TeamId)
            {
                 var newTeam = await _context.Teams.FindAsync(model.TeamId);
                 if (newTeam != null) athlete.CoachId = (int)newTeam.CoachId!;
            }
            // Update athlete fields
            athlete.FirstName = model.FirstName;
            athlete.LastName = model.LastName;
            athlete.JerseyNumber = model.JerseyNumber;
            athlete.Height = model.Height;
            athlete.Weight = model.Weight;
            athlete.Phone = model.Phone;
            athlete.BirthDate = model.BirthDate;
            athlete.TeamId = model.TeamId;
            athlete.PositionId = model.PositionId;

            // Update Team and Position relationship IDs when changed.
            // EF Core SaveChanges() persists these updates.

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
