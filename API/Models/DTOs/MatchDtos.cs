namespace API.Models.DTOs
{
    public class CreateMatchDto
    {
        public DateTime MatchDate { get; set; }
        public string Opponent { get; set; } = string.Empty; // Translated comment.
        public bool IsHome { get; set; } // Translated comment.
        public int TeamId { get; set; }
    }

    public class MatchResponseDto
    {
        public int Id { get; set; }
        public DateTime MatchDate { get; set; }
        public string Opponent { get; set; } = string.Empty;
        public bool IsHome { get; set; }
        public string TeamName { get; set; } = string.Empty;
        
        // Translated comment.
        public int? TeamScore { get; set; }
        public int? OpponentScore { get; set; }
        
        // Translated comment.
        public string Status => TeamScore.HasValue ? "Tamamlandı" : "Planlandı";
    }
}