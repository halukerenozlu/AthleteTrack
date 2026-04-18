using API.Data;
using API.Models.DTOs;
using API.Models.Entities; // Eklendi
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

            // 1. Kart Verileri
            summary.TotalAthletes = await _context.Athletes.CountAsync(a => a.Team!.CoachId == coachId);
            summary.ActiveInjuries = await _context.Injuries.CountAsync(i => i.IsActive && i.Athlete!.Team!.CoachId == coachId);

            // Katılım Oranı
            var lastMonthAttendances = await _context.TrainingAttendances
                .Include(ta => ta.Training)
                .Where(ta => ta.Training!.Team!.CoachId == coachId && ta.Training.Date >= DateTime.Now.AddDays(-30))
                .ToListAsync();

            if (lastMonthAttendances.Any())
            {
                double present = lastMonthAttendances.Count(ta => ta.IsPresent);
                summary.AttendanceRate = Math.Round((present / lastMonthAttendances.Count) * 100, 1);
            }

            // Sıradaki Maç
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

            // 2. Grafikler
            summary.TeamStats = await _context.Teams
                .Where(t => t.CoachId == coachId)
                .Select(t => new TeamStatDto { TeamName = t.Name, AthleteCount = t.Athletes.Count() })
                .ToListAsync();

            // 3. Son Aktiviteler (Son 5 Antrenman)
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

            // --- 4. GELİŞMİŞ SQL ANALİZİ (YENİ) ---
            
            // A. Gol Krallığı (En çok gol atan 3 oyuncu)
            var topScorers = await _context.MatchStatistics
                .Include(ms => ms.Athlete).ThenInclude(a => a!.Team)
                .Where(ms => ms.Athlete!.Team!.CoachId == coachId) // Sadece bu hocanın oyuncuları
                .GroupBy(ms => ms.AthleteId) // Oyuncuya göre grupla
                .Select(g => new 
                {
                    AthleteId = g.Key,
                    TotalGoals = g.Sum(x => x.Goals), // Golleri topla
                    Athlete = g.First().Athlete // Oyuncu bilgisini al
                })
                .OrderByDescending(x => x.TotalGoals) // En çok atana göre sırala
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

            // B. En Yüksek Puan (Ortalama Ratingi en yüksek 3 oyuncu)
            var topRated = await _context.MatchStatistics
                .Include(ms => ms.Athlete).ThenInclude(a => a!.Team)
                .Where(ms => ms.Athlete!.Team!.CoachId == coachId && ms.Rating > 0)
                .GroupBy(ms => ms.AthleteId)
                .Select(g => new 
                {
                    AthleteId = g.Key,
                    AvgRating = g.Average(x => x.Rating), // Ortalamayı al
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