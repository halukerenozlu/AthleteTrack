using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities
{
    public class InjuryType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty; // Örn: Ön Çapraz Bağ

        public string? Description { get; set; }
    }
}