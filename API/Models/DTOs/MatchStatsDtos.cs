namespace API.Models.DTOs
{
    // Create model
    public class CreateMatchStatDto
    {
        public int MatchId { get; set; }
        public List<PlayerStatDto> Stats { get; set; } = new();
    }

    public class PlayerStatDto
    {
        public int AthleteId { get; set; }
        public int MinutesPlayed { get; set; }
        public int Goals { get; set; }
        public int Assists { get; set; }
        public double Rating { get; set; }
        public double DistanceCovered { get; set; }
    }

    // List model (response)
    public class MatchStatResponseDto
    {
        public int Id { get; set; }
        public int AthleteId { get; set; }
        public string AthleteName { get; set; } = string.Empty;
        public int? JerseyNumber { get; set; }
        public string Position { get; set; } = string.Empty;
        public byte[]? AthleteImage { get; set; }
        
        public int MinutesPlayed { get; set; }
        public int Goals { get; set; }
        public int Assists { get; set; }
        public double Rating { get; set; }
        public double DistanceCovered { get; set; }
    }
}
