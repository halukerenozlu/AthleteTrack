using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class MatchStatistic
    {
        [Key]
        public int Id { get; set; }

        // Which match?
        public int MatchId { get; set; }
        [ForeignKey("MatchId")]
        public Match? Match { get; set; }

        // Which athlete?
        public int AthleteId { get; set; }
        [ForeignKey("AthleteId")]
        public Athlete? Athlete { get; set; }

        // Statistics
        public int MinutesPlayed { get; set; } // Minutes
        public int Goals { get; set; } = 0;
        public int Assists { get; set; } = 0;
        public double Rating { get; set; } = 0.0; // Score out of 10
        public double DistanceCovered { get; set; } = 0.0; // Distance covered (km)
    }
}
