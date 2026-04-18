using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class MatchStatistic
    {
        [Key]
        public int Id { get; set; }

        // Translated comment.
        public int MatchId { get; set; }
        [ForeignKey("MatchId")]
        public Match? Match { get; set; }

        // Translated comment.
        public int AthleteId { get; set; }
        [ForeignKey("AthleteId")]
        public Athlete? Athlete { get; set; }

        // Translated comment.
        public int MinutesPlayed { get; set; } // Translated comment.
        public int Goals { get; set; } = 0;
        public int Assists { get; set; } = 0;
        public double Rating { get; set; } = 0.0; // Translated comment.
        public double DistanceCovered { get; set; } = 0.0; // Translated comment.
    }
}
