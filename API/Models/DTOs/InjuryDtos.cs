namespace API.Models.DTOs
{
    // Translated comment.
    public class CreateInjuryDto
    {
        public int AthleteId { get; set; } // Translated comment.
        public int InjuryTypeId { get; set; } // Translated comment.
        public DateTime InjuryDate { get; set; } // Translated comment.
        public DateTime? ExpectedReturnDate { get; set; } // Translated comment.
        public string? Notes { get; set; } // Translated comment.
    }

    // Translated comment.
    public class InjuryResponseDto
    {
        public int Id { get; set; }
        public string AthleteName { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;
        public byte[]? AthleteImage { get; set; } // Translated comment.
        public string InjuryTypeName { get; set; } = string.Empty;
        public DateTime InjuryDate { get; set; }
        public DateTime? ExpectedReturnDate { get; set; }
        public bool IsActive { get; set; } // Translated comment.
        public string? Notes { get; set; }
    }
}