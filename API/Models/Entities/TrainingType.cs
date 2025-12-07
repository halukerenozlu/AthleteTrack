using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities
{
    public class TrainingType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty; // Örn: Kondisyon
        
        [MaxLength(7)]
        public string ColorCode { get; set; } = "#000000"; 
    }
}