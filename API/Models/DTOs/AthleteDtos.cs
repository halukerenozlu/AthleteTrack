namespace API.Models.DTOs
{
    // Translated comment.
    public class CreateAthleteDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int? JerseyNumber { get; set; }
        public int Height { get; set; }
        public double Weight { get; set; }
        public string? Phone { get; set; }
        
        public int TeamId { get; set; } // Translated comment.
        public int PositionId { get; set; } // Translated comment.
        
        public DateTime BirthDate { get; set; }
    }

    // Translated comment.
    public class AthleteResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int? JerseyNumber { get; set; }
        public string Position { get; set; } = string.Empty; // Translated comment.
        public string TeamName { get; set; } = string.Empty;
        public int Age { get; set; } // Translated comment.
        public bool HasImage { get; set; } // Translated comment.
        public int Height { get; set; }
        public double Weight { get; set; }
        public string? Phone { get; set; }
        public DateTime BirthDate { get; set; }
    }
}
