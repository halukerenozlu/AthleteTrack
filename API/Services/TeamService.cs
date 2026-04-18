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

        // Translated comment.
        public async Task<List<TeamResponseDto>> GetTeamsByCoachAsync(int coachId)
        {
            var teams = await _context.Teams
                .Where(t => t.CoachId == coachId) // Translated comment.
                .Include(t => t.Athletes) // Translated comment.
                .Select(t => new TeamResponseDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Category = t.Category,
                    PlayerCount = t.Athletes.Count() // Translated comment.
                })
                .ToListAsync();

            return teams;
        }

        // Translated comment.
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

        // Translated comment.
        public async Task<bool> DeleteTeamAsync(int teamId)
        {
            var team = await _context.Teams
                .Include(t => t.Athletes)
                .FirstOrDefaultAsync(t => t.Id == teamId);

            if (team == null) return false;

            // Translated comment.
            // Translated comment.
            var trainings = await _context.Trainings
                .Where(t => t.TeamId == teamId)
                .ToListAsync(); 

            foreach(var training in trainings)
            {
                 var attendances = _context.TrainingAttendances.Where(ta => ta.TrainingId == training.Id);
                 _context.TrainingAttendances.RemoveRange(attendances);
            }
            _context.Trainings.RemoveRange(trainings);

            // Translated comment.
            // Translated comment.
            var matches = await _context.Matches
                .Where(m => m.TeamId == teamId)
                .ToListAsync();

            foreach(var match in matches)
            {
                var stats = _context.MatchStatistics.Where(ms => ms.MatchId == match.Id);
                _context.MatchStatistics.RemoveRange(stats);
            }
            _context.Matches.RemoveRange(matches);

            // Translated comment.
            // Translated comment.
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
            // Translated comment.
            
            // Translated comment.
            _context.Teams.Remove(team);
            
            await _context.SaveChangesAsync();
            return true;
        }

        // Translated comment.
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
