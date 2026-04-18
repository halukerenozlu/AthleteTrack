namespace API.Models.DTOs
{
    // Incoming payload when creating an athlete from frontend
    public class CreateAthleteDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int? JerseyNumber { get; set; }
        public int Height { get; set; }
        public double Weight { get; set; }
        public string? Phone { get; set; }
        
        public int TeamId { get; set; } // Target team
        public int PositionId { get; set; } // Position (Goalkeeper, Forward, ...)
        
        public DateTime BirthDate { get; set; }
    }

    // Data returned to frontend for listing
    public class AthleteResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int? JerseyNumber { get; set; }
        public string Position { get; set; } = string.Empty; // Position label
        public string TeamName { get; set; } = string.Empty;
        public int Age { get; set; } // Computed from birth date
        public bool HasImage { get; set; } // Indicates whether athlete has an image
        public int Height { get; set; }
        public double Weight { get; set; }
        public string? Phone { get; set; }
        public DateTime BirthDate { get; set; }
    }
}
