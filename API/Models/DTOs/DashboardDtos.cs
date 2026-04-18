namespace API.Models.DTOs
{
    public class DashboardSummaryDto
    {
        // Translated comment.
        public int TotalAthletes { get; set; }
        public int ActiveInjuries { get; set; }
        public double AttendanceRate { get; set; } // Translated comment.
        public string NextMatchDate { get; set; } = "Yok";

        // Translated comment.
        public List<TeamStatDto> TeamStats { get; set; } = new(); // Translated comment.
        public List<InjuryStatDto> InjuryStats { get; set; } = new(); // Translated comment.
        
        // Translated comment.
        public List<RecentActivityDto> RecentActivities { get; set; } = new();

        // Translated comment.
        public List<TopPerformerDto> TopScorers { get; set; } = new(); // Translated comment.
        public List<TopPerformerDto> TopRatedPlayers { get; set; } = new(); // Translated comment.
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
        public string Title { get; set; } = string.Empty; // Translated comment.
        public string Date { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Translated comment.
    }

    public class TopPerformerDto
    {
        public int AthleteId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;
        public byte[]? Image { get; set; }
        public double Value { get; set; } // Translated comment.
        public string Label { get; set; } = string.Empty; // Translated comment.
    }
}
