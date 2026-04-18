using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities
{
    public class InjuryType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty; // Translated comment.

        public string? Description { get; set; }
    }
}