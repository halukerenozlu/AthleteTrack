namespace API.Models.DTOs
{
    // Training creation payload
    public class CreateTrainingDto
    {
        public DateTime Date { get; set; }
        public int DurationMinutes { get; set; }
        public string? Notes { get; set; }
        public int TeamId { get; set; }
        public int TrainingTypeId { get; set; } // Conditioning, tactics, ...
    }

    // Training list response (for calendar)
    public class TrainingResponseDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int DurationMinutes { get; set; }
        public string? Notes { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string TypeName { get; set; } = string.Empty; // Conditioning
        public string ColorCode { get; set; } = string.Empty; // Calendar color code
        public int ParticipantCount { get; set; } // Participant count
    }

    // Attendance list (players in one training)
    public class AttendanceDto
    {
        public int AthleteId { get; set; }
        public string AthleteName { get; set; } = string.Empty;
        public bool IsPresent { get; set; } // Attended?
        public int? PerformanceRating { get; set; } // Rating between 1 and 10
    }

    // Attendance save request
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
