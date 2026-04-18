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
        public string Name { get; set; } = string.Empty; // Example: U19 Team

        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // Example: Academy

        // Relationship: Which coach manages this team?
        public int? CoachId { get; set; }
        [ForeignKey("CoachId")]
        public User? Coach { get; set; }

        // Team athletes (one-to-many)
        public ICollection<Athlete> Athletes { get; set; } = new List<Athlete>();

    
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
