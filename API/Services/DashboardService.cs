using API.Data;
using API.Models.DTOs;
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

            // 1. Toplam Sporcu Sayısı (Hocanın takımlarındaki)
            summary.TotalAthletes = await _context.Athletes
                .CountAsync(a => a.Team!.CoachId == coachId);

            // 2. Aktif Sakatlık Sayısı
            summary.ActiveInjuries = await _context.Injuries
                .CountAsync(i => i.IsActive && i.Athlete!.Team!.CoachId == coachId);

            // 3. Katılım Oranı (Son 30 gün) - COMPLEX QUERY 🧠
            // Tüm yoklamaları al -> Geldi/Gelmedi oranla
            var lastMonthAttendances = await _context.TrainingAttendances
                .Include(ta => ta.Training)
                .Where(ta => ta.Training!.Team!.CoachId == coachId && 
                             ta.Training.Date >= DateTime.Now.AddDays(-30))
                .ToListAsync();

            if (lastMonthAttendances.Any())
            {
                double presentCount = lastMonthAttendances.Count(ta => ta.IsPresent);
                double totalCount = lastMonthAttendances.Count;
                summary.AttendanceRate = Math.Round((presentCount / totalCount) * 100, 1);
            }
            else
            {
                summary.AttendanceRate = 0;
            }

            // 4. Sıradaki Maç (Gelecekteki ilk maç)
            // Not: Match tablosunu henüz tam kullanmadık ama mantık şöyle olur:
            var nextMatch = await _context.Matches
                .Where(m => m.Team!.CoachId == coachId && m.MatchDate > DateTime.Now)
                .OrderBy(m => m.MatchDate)
                .FirstOrDefaultAsync();

            if (nextMatch != null)
            {
                // Kalan gün hesabı
                var daysLeft = (nextMatch.MatchDate - DateTime.Now).Days;
                summary.NextMatchDate = daysLeft == 0 ? "Bugün" : $"{daysLeft} Gün Sonra";
            }

            // 5. Takım Dağılımı (Grafik Verisi)
            summary.TeamStats = await _context.Teams
                .Where(t => t.CoachId == coachId)
                .Select(t => new TeamStatDto
                {
                    TeamName = t.Name,
                    AthleteCount = t.Athletes.Count()
                })
                .ToListAsync();
            
            // 6. Son Aktiviteler (Hem idmanları hem sakatlıkları birleştirip son 5'i al)
            // Bu biraz ileri seviye, şimdilik sadece son antrenmanları çekelim.
            var recentTrainings = await _context.Trainings
                .Include(t => t.Team)
                .Include(t => t.TrainingType)
                .Where(t => t.Team!.CoachId == coachId)
                .OrderByDescending(t => t.Date)
                .Take(5)
                .Select(t => new RecentActivityDto
                {
                    Id = t.Id,
                    Title = $"{t.Team!.Name} - {t.TrainingType!.Name} İdmanı",
                    Date = t.Date.ToString("dd MMM HH:mm"),
                    Type = "Training"
                })
                .ToListAsync();

            summary.RecentActivities = recentTrainings;

            return summary;
        }
    }
}