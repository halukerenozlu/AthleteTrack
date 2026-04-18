using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class Injury
    {
        [Key]
        public int Id { get; set; }

        public DateTime InjuryDate { get; set; } // Injury date
        public DateTime? ExpectedReturnDate { get; set; } // Expected return date
        public bool IsActive { get; set; } = true; // Still injured?

        public string? Notes { get; set; }

        // --- RELATIONSHIPS ---
        // 1. Which athlete is injured?
        public int AthleteId { get; set; }
        [ForeignKey("AthleteId")]
        public Athlete? Athlete { get; set; }

        // 2. Which injury type? -> Linked to InjuryTypes
        public int InjuryTypeId { get; set; }
        [ForeignKey("InjuryTypeId")]
        public InjuryType? InjuryType { get; set; }
    }
}
