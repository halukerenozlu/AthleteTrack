namespace API.Models.DTOs
{
    // Incoming payload when creating an injury
    public class CreateInjuryDto
    {
        public int AthleteId { get; set; } // Injured athlete
        public int InjuryTypeId { get; set; } // Injury type (fracture, strain, ...)
        public DateTime InjuryDate { get; set; } // Injury date
        public DateTime? ExpectedReturnDate { get; set; } // Expected return (optional)
        public string? Notes { get; set; } // Medical notes
    }

    // Data returned for listing
    public class InjuryResponseDto
    {
        public int Id { get; set; }
        public string AthleteName { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;
        public byte[]? AthleteImage { get; set; } // Profile image (for display)
        public string InjuryTypeName { get; set; } = string.Empty;
        public DateTime InjuryDate { get; set; }
        public DateTime? ExpectedReturnDate { get; set; }
        public bool IsActive { get; set; } // Still injured?
        public string? Notes { get; set; }
    }
}
