using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class Injury
    {
        [Key]
        public int Id { get; set; }

        public DateTime InjuryDate { get; set; } // Translated comment.
        public DateTime? ExpectedReturnDate { get; set; } // Translated comment.
        public bool IsActive { get; set; } = true; // Translated comment.

        public string? Notes { get; set; }

        // Translated comment.
        // Translated comment.
        public int AthleteId { get; set; }
        [ForeignKey("AthleteId")]
        public Athlete? Athlete { get; set; }

        // Translated comment.
        public int InjuryTypeId { get; set; }
        [ForeignKey("InjuryTypeId")]
        public InjuryType? InjuryType { get; set; }
    }
}