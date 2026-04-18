using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class TrainingAttendance
    {
        [Key]
        public int Id { get; set; }

        // Which training?
        public int TrainingId { get; set; }
        [ForeignKey("TrainingId")]
        public Training? Training { get; set; }

        // Which athlete?
        public int AthleteId { get; set; }
        [ForeignKey("AthleteId")]
        public Athlete? Athlete { get; set; }

        // Attended? (Default: yes)
        public bool IsPresent { get; set; } = true;
        
        // Performance rating (1-10, optional)
        public int? PerformanceRating { get; set; }
    }
}
