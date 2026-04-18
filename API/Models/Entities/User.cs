using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty; // Username

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty; // Email (used for login)

        [Required]
        public string PasswordHash { get; set; } = string.Empty; // Hashed password

        [MaxLength(20)]
        public string Role { get; set; } = "Coach"; // Admin, Coach, Player

        public string? FullName { get; set; } // Full name

        public string? PhoneNumber { get; set; } // Phone number

        // Store coach profile image as a byte array.
        public byte[]? ProfileImage { get; set; }

        public bool IsTemporaryPassword { get; set; } = true; // Temporary by default
        public DateTime? PasswordExpiresAt { get; set; } // Expiration date

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // NEW: Account active/inactive flag (default: active)
        public bool IsActive { get; set; } = true;
    }
}
