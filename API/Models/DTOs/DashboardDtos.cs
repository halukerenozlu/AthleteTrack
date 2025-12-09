namespace API.Models.DTOs
{
    public class DashboardSummaryDto
    {
        // 1. Üst Kartlar (Sayılar)
        public int TotalAthletes { get; set; }
        public int ActiveInjuries { get; set; }
        public double AttendanceRate { get; set; } // Katılım Oranı (%)
        public string NextMatchDate { get; set; } = "Yok";

        // 2. Grafikler İçin Veriler
        public List<TeamStatDto> TeamStats { get; set; } = new(); // Takım bazlı oyuncu dağılımı
        public List<InjuryStatDto> InjuryStats { get; set; } = new(); // Sakatlık türü dağılımı
        
        // 3. Son Aktiviteler
        public List<RecentActivityDto> RecentActivities { get; set; } = new();
    }

    public class TeamStatDto
    {
        public string TeamName { get; set; } = string.Empty;
        public int AthleteCount { get; set; }
    }

    public class InjuryStatDto
    {
        public string TypeName { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class RecentActivityDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty; // "Ahmet antrenmana katıldı"
        public string Date { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "Training", "Injury" vb.
    }
}