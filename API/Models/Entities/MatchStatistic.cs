using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class MatchStatistic
    {
        [Key]
        public int Id { get; set; }

        // Hangi Maç?
        public int MatchId { get; set; }
        [ForeignKey("MatchId")]
        public Match? Match { get; set; }

        // Hangi Oyuncu?
        public int AthleteId { get; set; }
        [ForeignKey("AthleteId")]
        public Athlete? Athlete { get; set; }

        // İstatistikler
        public int MinutesPlayed { get; set; } // Dakika
        public int Goals { get; set; } = 0;
        public int Assists { get; set; } = 0;
        public double Rating { get; set; } = 0.0; // 10 üzerinden puan
        public double DistanceCovered { get; set; } = 0.0; // Koşu mesafesi (km)
    }
}