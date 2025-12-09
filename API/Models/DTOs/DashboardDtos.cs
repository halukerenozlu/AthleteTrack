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

        // --- YENİ: Liderlik Tabloları ---
        public List<TopPerformerDto> TopScorers { get; set; } = new(); // Gol Kralları
        public List<TopPerformerDto> TopRatedPlayers { get; set; } = new(); // En Yüksek Puanlılar
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

    public class TopPerformerDto
    {
        public int AthleteId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;
        public byte[]? Image { get; set; }
        public double Value { get; set; } // Gol sayısı veya Puan
        public string Label { get; set; } = string.Empty; // "12 Gol" veya "8.5 Puan"
    }
}