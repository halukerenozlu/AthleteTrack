using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty; // Translated comment.

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty; // Translated comment.

        [Required]
        public string PasswordHash { get; set; } = string.Empty; // Translated comment.

        [MaxLength(20)]
        public string Role { get; set; } = "Coach"; // Translated comment.

        public string? FullName { get; set; } // Translated comment.

        public string? PhoneNumber { get; set; } // Translated comment.

        // Translated comment.
        public byte[]? ProfileImage { get; set; }

        public bool IsTemporaryPassword { get; set; } = true; // Translated comment.
        public DateTime? PasswordExpiresAt { get; set; } // Translated comment.

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Translated comment.
        public bool IsActive { get; set; } = true;
    }
}