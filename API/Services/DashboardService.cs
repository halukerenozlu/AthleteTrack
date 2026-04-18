using API.Data;
using API.Models.DTOs;
using API.Models.Entities; // Translated comment.
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class DashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync(int coachId)
        {
            var summary = new DashboardSummaryDto();

            // Translated comment.
            summary.TotalAthletes = await _context.Athletes.CountAsync(a => a.Team!.CoachId == coachId);
            summary.ActiveInjuries = await _context.Injuries.CountAsync(i => i.IsActive && i.Athlete!.Team!.CoachId == coachId);

            // Translated comment.
            var lastMonthAttendances = await _context.TrainingAttendances
                .Include(ta => ta.Training)
                .Where(ta => ta.Training!.Team!.CoachId == coachId && ta.Training.Date >= DateTime.Now.AddDays(-30))
                .ToListAsync();

            if (lastMonthAttendances.Any())
            {
                double present = lastMonthAttendances.Count(ta => ta.IsPresent);
                summary.AttendanceRate = Math.Round((present / lastMonthAttendances.Count) * 100, 1);
            }

            // Translated comment.
            var nextMatch = await _context.Matches
                .Where(m => m.Team!.CoachId == coachId && m.MatchDate > DateTime.Now)
                .OrderBy(m => m.MatchDate)
                .FirstOrDefaultAsync();

            if (nextMatch != null)
            {
                var daysLeft = (nextMatch.MatchDate - DateTime.Now).Days;
                summary.NextMatchDate = daysLeft == 0 ? "Bugün" : $"{daysLeft} Gün Sonra";
            }
            else 
            {
                summary.NextMatchDate = "Yok";
            }

            // Translated comment.
            summary.TeamStats = await _context.Teams
                .Where(t => t.CoachId == coachId)
                .Select(t => new TeamStatDto { TeamName = t.Name, AthleteCount = t.Athletes.Count() })
                .ToListAsync();

            // Translated comment.
            summary.RecentActivities = await _context.Trainings
                .Include(t => t.Team)
                .Include(t => t.TrainingType)
                .Where(t => t.Team!.CoachId == coachId)
                .OrderByDescending(t => t.Date)
                .Take(5)
                .Select(t => new RecentActivityDto
                {
                    Id = t.Id,
                    Title = $"{t.Team!.Name} - {t.TrainingType!.Name}",
                    Date = t.Date.ToString("dd MMM HH:mm"),
                    Type = "Training"
                })
                .ToListAsync();

            // Translated comment.
            
            // Translated comment.
            var topScorers = await _context.MatchStatistics
                .Include(ms => ms.Athlete).ThenInclude(a => a!.Team)
                .Where(ms => ms.Athlete!.Team!.CoachId == coachId) // Translated comment.
                .GroupBy(ms => ms.AthleteId) // Translated comment.
                .Select(g => new 
                {
                    AthleteId = g.Key,
                    TotalGoals = g.Sum(x => x.Goals), // Translated comment.
                    Athlete = g.First().Athlete // Translated comment.
                })
                .OrderByDescending(x => x.TotalGoals) // Translated comment.
                .Take(3)
                .ToListAsync();

            summary.TopScorers = topScorers.Select(x => new TopPerformerDto
            {
                AthleteId = x.AthleteId,
                Name = $"{x.Athlete!.FirstName} {x.Athlete.LastName}",
                TeamName = x.Athlete.Team?.Name ?? "-",
                Image = x.Athlete.ProfileImage,
                Value = x.TotalGoals,
                Label = "Gol"
            }).ToList();

            // Translated comment.
            var topRated = await _context.MatchStatistics
                .Include(ms => ms.Athlete).ThenInclude(a => a!.Team)
                .Where(ms => ms.Athlete!.Team!.CoachId == coachId && ms.Rating > 0)
                .GroupBy(ms => ms.AthleteId)
                .Select(g => new 
                {
                    AthleteId = g.Key,
                    AvgRating = g.Average(x => x.Rating), // Translated comment.
                    Athlete = g.First().Athlete
                })
                .OrderByDescending(x => x.AvgRating)
                .Take(3)
                .ToListAsync();

             summary.TopRatedPlayers = topRated.Select(x => new TopPerformerDto
            {
                AthleteId = x.AthleteId,
                Name = $"{x.Athlete!.FirstName} {x.Athlete.LastName}",
                TeamName = x.Athlete.Team?.Name ?? "-",
                Image = x.Athlete.ProfileImage,
                Value = Math.Round(x.AvgRating, 1),
                Label = "Ort. Puan"
            }).ToList();

            return summary;
        }
    }
}
