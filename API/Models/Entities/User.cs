using System.ComponentModel.DataAnnotations;

namespace API.Models.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty; // Kullanıcı Adı

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty; // Email (Login için)

        [Required]
        public string PasswordHash { get; set; } = string.Empty; // Şifreli Şifre

        [MaxLength(20)]
        public string Role { get; set; } = "Coach"; // Admin, Coach, Player

        public string? FullName { get; set; } // Ad Soyad

        public string? PhoneNumber { get; set; } // Telefon numarası

        // Hocanın "Image/Binary" şartı için resmi byte dizisi olarak tutuyoruz.
        public byte[]? ProfileImage { get; set; }

        public bool IsTemporaryPassword { get; set; } = true; // İlk başta herkesinki geçicidir
        public DateTime? PasswordExpiresAt { get; set; } // Ne zaman doluyor?

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // YENİ: Hesap açık mı kapalı mı? (Varsayılan: true/açık)
        public bool IsActive { get; set; } = true;
    }
}