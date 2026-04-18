namespace API.Models.DTOs
{
    public class DashboardSummaryDto
    {
        // 1. Top cards (metrics)
        public int TotalAthletes { get; set; }
        public int ActiveInjuries { get; set; }
        public double AttendanceRate { get; set; } // Attendance rate (%)
        public string NextMatchDate { get; set; } = "Yok";

        // 2. Data for charts
        public List<TeamStatDto> TeamStats { get; set; } = new(); // Team-based player distribution
        public List<InjuryStatDto> InjuryStats { get; set; } = new(); // Injury type distribution
        
        // 3. Recent activities
        public List<RecentActivityDto> RecentActivities { get; set; } = new();

        // --- NEW: Leaderboards ---
        public List<TopPerformerDto> TopScorers { get; set; } = new(); // Top scorers
        public List<TopPerformerDto> TopRatedPlayers { get; set; } = new(); // Highest rated players
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
        public string Title { get; set; } = string.Empty; // "Ahmet attended training"
        public string Date { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "Training", "Injury", etc.
    }

    public class TopPerformerDto
    {
        public int AthleteId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;
        public byte[]? Image { get; set; }
        public double Value { get; set; } // Goal count or score
        public string Label { get; set; } = string.Empty; // "12 Goals" or "8.5 Rating"
    }
}
