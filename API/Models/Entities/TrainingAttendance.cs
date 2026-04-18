using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class TrainingAttendance
    {
        [Key]
        public int Id { get; set; }

        // Translated comment.
        public int TrainingId { get; set; }
        [ForeignKey("TrainingId")]
        public Training? Training { get; set; }

        // Translated comment.
        public int AthleteId { get; set; }
        [ForeignKey("AthleteId")]
        public Athlete? Athlete { get; set; }

        // Translated comment.
        public bool IsPresent { get; set; } = true;
        
        // Translated comment.
        public int? PerformanceRating { get; set; }
    }
}
