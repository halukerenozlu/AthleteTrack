using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities
{
    public class Position
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty; // Örn: Kaleci

        [MaxLength(10)]
        public string ShortName { get; set; } = string.Empty; // Örn: GK
    }
}