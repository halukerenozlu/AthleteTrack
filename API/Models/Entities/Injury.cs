using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models.Entities
{
    public class Injury
    {
        [Key]
        public int Id { get; set; }

        public DateTime InjuryDate { get; set; } // Sakatlanma Tarihi
        public DateTime? ExpectedReturnDate { get; set; } // Tahmini Dönüş
        public bool IsActive { get; set; } = true; // Hala sakat mı?

        public string? Notes { get; set; }

        // --- İLİŞKİLER ---
        // 1. Kim Sakatlandı?
        public int AthleteId { get; set; }
        [ForeignKey("AthleteId")]
        public Athlete? Athlete { get; set; }

        // 2. Ne Tür Sakatlık? -> InjuryTypes ile bağlanıyor!
        public int InjuryTypeId { get; set; }
        [ForeignKey("InjuryTypeId")]
        public InjuryType? InjuryType { get; set; }
    }
}