namespace API.Models.DTOs
{
    public class CreateMatchDto
    {
        public DateTime MatchDate { get; set; }
        public string Opponent { get; set; } = string.Empty; // Rakip Takım
        public bool IsHome { get; set; } // İç Saha mı?
        public int TeamId { get; set; }
    }

    public class MatchResponseDto
    {
        public int Id { get; set; }
        public DateTime MatchDate { get; set; }
        public string Opponent { get; set; } = string.Empty;
        public bool IsHome { get; set; }
        public string TeamName { get; set; } = string.Empty;
        
        // Skor (Oynanmamışsa null gelir)
        public int? TeamScore { get; set; }
        public int? OpponentScore { get; set; }
        
        // Durum (Oynandı / Gelecek)
        public string Status => TeamScore.HasValue ? "Tamamlandı" : "Planlandı";
    }
}