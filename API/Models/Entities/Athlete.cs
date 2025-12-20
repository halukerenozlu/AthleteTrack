using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class Athlete
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        public int? JerseyNumber { get; set; } 
        public DateTime BirthDate { get; set; }
        public int Height { get; set; } // cm
        public double Weight { get; set; } // kg

        public string? Phone { get; set; }
        public byte[]? ProfileImage { get; set; } 

        // --- İLİŞKİLER ---
        public int? TeamId { get; set; }
        [ForeignKey("TeamId")]
        public Team? Team { get; set; }
        // Sporcuyu direkt hocaya bağlıyoruz
        public int CoachId { get; set; }
        public int PositionId { get; set; }
        [ForeignKey("PositionId")]
        public Position? Position { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}