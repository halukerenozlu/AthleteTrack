using API.Data;
using API.Models.DTOs;
using API.Models.Entities; // Added
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

            // 1. Card metrics
            summary.TotalAthletes = await _context.Athletes.CountAsync(a => a.Team!.CoachId == coachId);
            summary.ActiveInjuries = await _context.Injuries.CountAsync(i => i.IsActive && i.Athlete!.Team!.CoachId == coachId);

            // Attendance rate
            var lastMonthAttendances = await _context.TrainingAttendances
                .Include(ta => ta.Training)
                .Where(ta => ta.Training!.Team!.CoachId == coachId && ta.Training.Date >= DateTime.Now.AddDays(-30))
                .ToListAsync();

            if (lastMonthAttendances.Any())
            {
                double present = lastMonthAttendances.Count(ta => ta.IsPresent);
                summary.AttendanceRate = Math.Round((present / lastMonthAttendances.Count) * 100, 1);
            }

            // Next match
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

            // 2. Charts
            summary.TeamStats = await _context.Teams
                .Where(t => t.CoachId == coachId)
                .Select(t => new TeamStatDto { TeamName = t.Name, AthleteCount = t.Athletes.Count() })
                .ToListAsync();

            // 3. Recent activities (last 5 trainings)
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

            // --- 4. ADVANCED SQL ANALYTICS (NEW) ---
            
            // A. Top scorers (top 3 goal scorers)
            var topScorers = await _context.MatchStatistics
                .Include(ms => ms.Athlete).ThenInclude(a => a!.Team)
                .Where(ms => ms.Athlete!.Team!.CoachId == coachId) // Only this coach's athletes
                .GroupBy(ms => ms.AthleteId) // Group by athlete
                .Select(g => new 
                {
                    AthleteId = g.Key,
                    TotalGoals = g.Sum(x => x.Goals), // Sum goals
                    Athlete = g.First().Athlete // Get athlete info
                })
                .OrderByDescending(x => x.TotalGoals) // Sort by highest goals
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

            // B. Highest rated players (top 3 by average rating)
            var topRated = await _context.MatchStatistics
                .Include(ms => ms.Athlete).ThenInclude(a => a!.Team)
                .Where(ms => ms.Athlete!.Team!.CoachId == coachId && ms.Rating > 0)
                .GroupBy(ms => ms.AthleteId)
                .Select(g => new 
                {
                    AthleteId = g.Key,
                    AvgRating = g.Average(x => x.Rating), // Compute average
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
