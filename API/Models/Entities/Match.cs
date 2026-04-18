using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class Match
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime MatchDate { get; set; }

        [Required]
        [MaxLength(100)]
        public string Opponent { get; set; } = string.Empty; // Rakip Takım Adı

        public bool IsHome { get; set; } = true; // İç saha mı?
        
        // Skor (Maç bitince girilecek)
        public int? TeamScore { get; set; }
        public int? OpponentScore { get; set; }

        // Hangi Takımımız Oynuyor?
        public int TeamId { get; set; }
        [ForeignKey("TeamId")]
        public Team? Team { get; set; }
    }
}