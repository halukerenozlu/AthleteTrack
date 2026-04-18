using API.Data;
using API.Models.Entities;
using API.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class TeamService
    {
        private readonly AppDbContext _context;

        public TeamService(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET TEAMS FOR A SPECIFIC COACH
        public async Task<List<TeamResponseDto>> GetTeamsByCoachAsync(int coachId)
        {
            var teams = await _context.Teams
                .Where(t => t.CoachId == coachId) // Security: only this coach's teams
                .Include(t => t.Athletes) // Include related table to count players
                .Select(t => new TeamResponseDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Category = t.Category,
                    PlayerCount = t.Athletes.Count() // Automatic player count
                })
                .ToListAsync();

            return teams;
        }

        // 2. ADD NEW TEAM
        public async Task<bool> AddTeamAsync(CreateTeamDto model)
        {
            var newTeam = new Team
            {
                Name = model.Name,
                Category = model.Category,
                CoachId = model.CoachId,
                CreatedAt = DateTime.Now
            };

            _context.Teams.Add(newTeam);
            await _context.SaveChangesAsync();
            return true;
        }

        // 3. DELETE TEAM (ENHANCED - Manual cascade)
        public async Task<bool> DeleteTeamAsync(int teamId)
        {
            var team = await _context.Teams
                .Include(t => t.Athletes)
                .FirstOrDefaultAsync(t => t.Id == teamId);

            if (team == null) return false;

            // --- A. DELETE RELATED TRAININGS ---
            // FIX: Materialize with .ToListAsync() to avoid DataReader errors.
            var trainings = await _context.Trainings
                .Where(t => t.TeamId == teamId)
                .ToListAsync(); 

            foreach(var training in trainings)
            {
                 var attendances = _context.TrainingAttendances.Where(ta => ta.TrainingId == training.Id);
                 _context.TrainingAttendances.RemoveRange(attendances);
            }
            _context.Trainings.RemoveRange(trainings);

            // --- B. DELETE RELATED MATCHES ---
            // FIX: Use .ToListAsync() here as well.
            var matches = await _context.Matches
                .Where(m => m.TeamId == teamId)
                .ToListAsync();

            foreach(var match in matches)
            {
                var stats = _context.MatchStatistics.Where(ms => ms.MatchId == match.Id);
                _context.MatchStatistics.RemoveRange(stats);
            }
            _context.Matches.RemoveRange(matches);

            // --- C. DELETE TEAM ATHLETES ---
            /*
            foreach (var athlete in team.Athletes)
            {
                var injuries = _context.Injuries.Where(i => i.AthleteId == athlete.Id);
                _context.Injuries.RemoveRange(injuries);
                
                var stats = _context.MatchStatistics.Where(ms => ms.AthleteId == athlete.Id);
                _context.MatchStatistics.RemoveRange(stats);

                var attendances = _context.TrainingAttendances.Where(ta => ta.AthleteId == athlete.Id);
                _context.TrainingAttendances.RemoveRange(attendances);
            }
            
            _context.Athletes.RemoveRange(team.Athletes);
            */
            
            // --- D. DELETE TEAM ---
            _context.Teams.Remove(team);
            
            await _context.SaveChangesAsync();
            return true;
        }

        // 4. UPDATE TEAM
        public async Task<bool> UpdateTeamAsync(int id, CreateTeamDto model)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null) return false;

            team.Name = model.Name;
            team.Category = model.Category;
            
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
