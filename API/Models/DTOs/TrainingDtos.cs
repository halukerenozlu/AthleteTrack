namespace API.Models.DTOs
{
    // Antrenman Ekleme
    public class CreateTrainingDto
    {
        public DateTime Date { get; set; }
        public int DurationMinutes { get; set; }
        public string? Notes { get; set; }
        public int TeamId { get; set; }
        public int TrainingTypeId { get; set; } // Kondisyon, Taktik...
    }

    // Antrenman Listeleme (Takvim İçin)
    public class TrainingResponseDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int DurationMinutes { get; set; }
        public string? Notes { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string TypeName { get; set; } = string.Empty; // Kondisyon
        public string ColorCode { get; set; } = string.Empty; // Takvimde renklendirmek için
        public int ParticipantCount { get; set; } // Kaç kişi katıldı?
    }

    // Yoklama Listesi (Bir idmandaki oyuncular)
    public class AttendanceDto
    {
        public int AthleteId { get; set; }
        public string AthleteName { get; set; } = string.Empty;
        public bool IsPresent { get; set; } // Geldi mi?
        public int? PerformanceRating { get; set; } // 1-10 arası puan
    }

    // Yoklama Kaydetme İsteği
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