using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class Training
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; } // Translated comment.

        [Required]
        public int DurationMinutes { get; set; } // Translated comment.

        public string? Notes { get; set; } // Translated comment.

        // Translated comment.
        // Translated comment.
        public int TeamId { get; set; }
        [ForeignKey("TeamId")]
        public Team? Team { get; set; }

        // Translated comment.
        public int TrainingTypeId { get; set; }
        [ForeignKey("TrainingTypeId")]
        public TrainingType? TrainingType { get; set; }

        // Translated comment.
        // Translated comment.
        public ICollection<TrainingAttendance> TrainingAttendances { get; set; } = new List<TrainingAttendance>();

        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}