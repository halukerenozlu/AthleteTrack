using API.Data;
using API.Models.Entities;
using API.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class MatchService
    {
        private readonly AppDbContext _context;

        public MatchService(AppDbContext context)
        {
            _context = context;
        }

        // 1. Add match
        public async Task<Match> CreateMatchAsync(CreateMatchDto model)
        {
            var match = new Match
            {
                MatchDate = model.MatchDate,
                Opponent = model.Opponent,
                IsHome = model.IsHome,
                TeamId = model.TeamId
            };

            _context.Matches.Add(match);
            await _context.SaveChangesAsync();
            return match;
        }

        // 2. Fetch coach fixtures
        public async Task<List<MatchResponseDto>> GetMatchesByCoachAsync(int coachId)
        {
            var matches = await _context.Matches
                .Include(m => m.Team)
                .Where(m => m.Team!.CoachId == coachId)
                .OrderBy(m => m.MatchDate) // Sort by date
                .ToListAsync();

            return matches.Select(m => new MatchResponseDto
            {
                Id = m.Id,
                MatchDate = m.MatchDate,
                Opponent = m.Opponent,
                IsHome = m.IsHome,
                TeamName = m.Team!.Name,
                TeamScore = m.TeamScore,
                OpponentScore = m.OpponentScore
            }).ToList();
        }

        // 3. Delete match
        public async Task<bool> DeleteMatchAsync(int id)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null) return false;

            _context.Matches.Remove(match);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
