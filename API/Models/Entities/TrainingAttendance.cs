using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class TrainingAttendance
    {
        [Key]
        public int Id { get; set; }

        // Hangi Antrenman?
        public int TrainingId { get; set; }
        [ForeignKey("TrainingId")]
        public Training? Training { get; set; }

        // Hangi Oyuncu?
        public int AthleteId { get; set; }
        [ForeignKey("AthleteId")]
        public Athlete? Athlete { get; set; }

        // Katıldı mı? (Varsayılan: Evet)
        public bool IsPresent { get; set; } = true;
        
        // Performans Puanı (1-10 arası, Opsiyonel)
        public int? PerformanceRating { get; set; }
    }
}