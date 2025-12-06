using API.Data;
using API.Models.Entities;
using API.Models.DTOs;
using Microsoft.EntityFrameworkCore;
// using BCrypt.Net; <-- Bu satırı sildik, gerek yok.

namespace API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        // --- LOGIN İŞLEMİ (HİBRİT KONTROL) ---
        public async Task<User?> LoginAsync(string email, string password)
        {
            // 1. Kullanıcıyı Stored Procedure ile getir
            var userList = await _context.Users
                .FromSqlRaw("EXEC sp_CheckUserLogin @Email = {0}", email)
                .ToListAsync();

            var user = userList.FirstOrDefault();

            if (user == null) return null;

            // Eğer hesap pasife alınmışsa, şifreye bakmaya bile gerek yok.
                 if (!user.IsActive) 
                     return null; // Veya özel hata fırlatabilirsin


            // 2. ŞİFRE KONTROLÜ (KRİTİK NOKTA) 🛡️
            bool isPasswordValid = false;

            // Eğer veritabanındaki şifre bir Hash ise (Genelde $ ile başlar)
            if (user.PasswordHash.StartsWith("$"))
            {
                try 
                {
                    // Hash doğrulaması yap
                    isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
                }
                catch 
                {
                    // Hash bozuksa düz metin kontrolü dene (Yedek plan)
                    isPasswordValid = (user.PasswordHash == password);
                }
            }
            else
            {
                // Eğer şifre "$..." ile başlamıyorsa DÜZ METİNDİR (Örn: "123456")
                // Direkt eşitlik kontrolü yap
                isPasswordValid = (user.PasswordHash == password);
            }

            if (!isPasswordValid) return null;

            return user;
        }

        // --- PROFİL GÜNCELLEME ---
        public async Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto model)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.FullName = model.FullName;
            user.PhoneNumber = model.PhoneNumber;

            await _context.SaveChangesAsync();
            return true;
        }

        // --- FOTOĞRAF GÜNCELLEME ---
        public async Task<bool> UpdateProfileImageAsync(int userId, byte[] imageBytes)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.ProfileImage = imageBytes;
            await _context.SaveChangesAsync();
            return true;
        }

        // --- ŞİFRE DEĞİŞTİRME ---
        public async Task<string> ChangePasswordAsync(int userId, ChangePasswordDto model)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return "Kullanıcı bulunamadı.";

            // 1. Eski şifre kontrolü (Burada da Hibrit yapıyoruz ki hata vermesin)
            bool isOldPasswordValid = false;
            if (user.PasswordHash.StartsWith("$"))
            {
                isOldPasswordValid = BCrypt.Net.BCrypt.Verify(model.CurrentPassword, user.PasswordHash);
            }
            else
            {
                isOldPasswordValid = (user.PasswordHash == model.CurrentPassword);
            }

            if (!isOldPasswordValid)
                return "Mevcut şifreniz yanlış!";

            // 2. Yeni şifreyi MUTLAKA Hash'le ve kaydet
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            
            user.PasswordHash = passwordHash;
            user.IsTemporaryPassword = false;
            user.PasswordExpiresAt = null;

            await _context.SaveChangesAsync();
            return "OK";
        }
        // RESİM GETİRME METODU
        public async Task<byte[]?> GetProfileImageAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user?.ProfileImage;
        }
    }
}