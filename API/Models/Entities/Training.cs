using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class Training
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; } // Tarih ve Saat

        [Required]
        public int DurationMinutes { get; set; } // Süre (dk)

        public string? Notes { get; set; } // Antrenman notları

        // --- İLİŞKİLER ---
        // 1. Hangi Takım?
        public int TeamId { get; set; }
        [ForeignKey("TeamId")]
        public Team? Team { get; set; }

        // 2. Hangi Tip? (Kondisyon, Taktik...) -> TrainingTypes ile bağlanıyor!
        public int TrainingTypeId { get; set; }
        [ForeignKey("TrainingTypeId")]
        public TrainingType? TrainingType { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}