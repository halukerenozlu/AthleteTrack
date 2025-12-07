using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class Team
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty; // Örn: U19 Takımı

        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // Örn: Altyapı

        // İlişki: Hangi Hoca Yönetiyor?
        public int? CoachId { get; set; }
        [ForeignKey("CoachId")]
        public User? Coach { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}