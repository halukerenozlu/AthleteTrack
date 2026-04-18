using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class Training
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; } // Date and time

        [Required]
        public int DurationMinutes { get; set; } // Duration (min)

        public string? Notes { get; set; } // Training notes

        // --- RELATIONSHIPS ---
        // 1. Which team?
        public int TeamId { get; set; }
        [ForeignKey("TeamId")]
        public Team? Team { get; set; }

        // 2. Which type? (Conditioning, tactics...) -> Linked to TrainingTypes
        public int TrainingTypeId { get; set; }
        [ForeignKey("TrainingTypeId")]
        public TrainingType? TrainingType { get; set; }

        // 3. ADDED SECTION: Attendance List (One-to-Many)
        // This avoids errors in "Include(t => t.TrainingAttendances)".
        public ICollection<TrainingAttendance> TrainingAttendances { get; set; } = new List<TrainingAttendance>();

        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
