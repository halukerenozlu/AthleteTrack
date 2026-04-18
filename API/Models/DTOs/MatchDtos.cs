namespace API.Models.DTOs
{
    public class CreateMatchDto
    {
        public DateTime MatchDate { get; set; }
        public string Opponent { get; set; } = string.Empty; // Opponent team
        public bool IsHome { get; set; } // Home match?
        public int TeamId { get; set; }
    }

    public class MatchResponseDto
    {
        public int Id { get; set; }
        public DateTime MatchDate { get; set; }
        public string Opponent { get; set; } = string.Empty;
        public bool IsHome { get; set; }
        public string TeamName { get; set; } = string.Empty;
        
        // Score (null if not played)
        public int? TeamScore { get; set; }
        public int? OpponentScore { get; set; }
        
        // Status (Played / Upcoming)
        public string Status => TeamScore.HasValue ? "Tamamlandı" : "Planlandı";
    }
}
