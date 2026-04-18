namespace API.Models.DTOs
{
    // Translated comment.
    public class CreateTrainingDto
    {
        public DateTime Date { get; set; }
        public int DurationMinutes { get; set; }
        public string? Notes { get; set; }
        public int TeamId { get; set; }
        public int TrainingTypeId { get; set; } // Translated comment.
    }

    // Translated comment.
    public class TrainingResponseDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int DurationMinutes { get; set; }
        public string? Notes { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string TypeName { get; set; } = string.Empty; // Translated comment.
        public string ColorCode { get; set; } = string.Empty; // Translated comment.
        public int ParticipantCount { get; set; } // Translated comment.
    }

    // Translated comment.
    public class AttendanceDto
    {
        public int AthleteId { get; set; }
        public string AthleteName { get; set; } = string.Empty;
        public bool IsPresent { get; set; } // Translated comment.
        public int? PerformanceRating { get; set; } // Translated comment.
    }

    // Translated comment.
    public class SaveAttendanceDto
    {
        public int TrainingId { get; set; }
        public List<AttendanceItemDto> Attendances { get; set; } = new();
    }

    public class AttendanceItemDto
    {
        public int AthleteId { get; set; }
        public bool IsPresent { get; set; }
        public int? PerformanceRating { get; set; }
    }
}
