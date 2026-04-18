using API.Data;
using API.Models.Entities;
using API.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class MatchStatService
    {
        private readonly AppDbContext _context;

        public MatchStatService(AppDbContext context)
        {
            _context = context;
        }

        // 1. Fetch match stats (if none exist, return blank stats for team athletes)
        public async Task<List<MatchStatResponseDto>> GetStatsByMatchAsync(int matchId)
        {
            // First, check whether saved stats exist for this match
            var existingStats = await _context.MatchStatistics
                .Include(ms => ms.Athlete)
                .ThenInclude(a => a!.Position)
                .Where(ms => ms.MatchId == matchId)
                .ToListAsync();

            if (existingStats.Any())
            {
                // Return existing stats
                return existingStats.Select(ms => new MatchStatResponseDto
                {
                    Id = ms.Id,
                    AthleteId = ms.AthleteId,
                    AthleteName = $"{ms.Athlete!.FirstName} {ms.Athlete.LastName}",
                    JerseyNumber = ms.Athlete.JerseyNumber,
                    Position = ms.Athlete.Position?.Name ?? "-",
                    AthleteImage = ms.Athlete.ProfileImage,
                    MinutesPlayed = ms.MinutesPlayed,
                    Goals = ms.Goals,
                    Assists = ms.Assists,
                    Rating = ms.Rating,
                    DistanceCovered = ms.DistanceCovered
                }).ToList();
            }

            // Otherwise, return blank templates for team athletes
            var match = await _context.Matches.FindAsync(matchId);
            if (match == null) return new List<MatchStatResponseDto>();

            var athletes = await _context.Athletes
                .Include(a => a.Position)
                .Where(a => a.TeamId == match.TeamId)
                .ToListAsync();

            return athletes.Select(a => new MatchStatResponseDto
            {
                Id = 0, // New record
                AthleteId = a.Id,
                AthleteName = $"{a.FirstName} {a.LastName}",
                JerseyNumber = a.JerseyNumber,
                Position = a.Position?.Name ?? "-",
                AthleteImage = a.ProfileImage,
                MinutesPlayed = 90, // Default: 90 minutes
                Goals = 0,
                Assists = 0,
                Rating = 6.0,
                DistanceCovered = 0
            }).ToList();
        }

        // 2. Save stats
        public async Task<bool> SaveStatsAsync(CreateMatchStatDto model)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Delete old records first (clean update)
                var oldStats = await _context.MatchStatistics.Where(ms => ms.MatchId == model.MatchId).ToListAsync();
                _context.MatchStatistics.RemoveRange(oldStats);
                await _context.SaveChangesAsync();

                // Add new records
                foreach (var stat in model.Stats)
                {
                    _context.MatchStatistics.Add(new MatchStatistic
                    {
                        MatchId = model.MatchId,
                        AthleteId = stat.AthleteId,
                        MinutesPlayed = stat.MinutesPlayed,
                        Goals = stat.Goals,
                        Assists = stat.Assists,
                        Rating = stat.Rating,
                        DistanceCovered = stat.DistanceCovered
                    });
                }

                // Update match score automatically
                var match = await _context.Matches.FindAsync(model.MatchId);
                if (match != null)
                {
                    match.TeamScore = model.Stats.Sum(s => s.Goals);
                    // Opponent score is not requested from user; keep null/0 for now.
                    // OpponentScore can be added to CreateMatchStatDto if needed.
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                return false;
            }
        }
    }
}
