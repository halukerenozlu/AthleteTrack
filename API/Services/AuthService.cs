using API.Data;
using API.Models.Entities;
using API.Models.DTOs;
using Microsoft.EntityFrameworkCore;
// Translated comment.

namespace API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        // Translated comment.
        public async Task<User?> LoginAsync(string email, string password)
        {
            // Translated comment.
            var userList = await _context.Users
                .FromSqlRaw("EXEC sp_CheckUserLogin @Email = {0}", email)
                .ToListAsync();

            var user = userList.FirstOrDefault();

            if (user == null) return null;

            // Translated comment.
                 if (!user.IsActive) 
                     return null; // Translated comment.


            // Translated comment.
            bool isPasswordValid = false;

            // Translated comment.
            if (user.PasswordHash.StartsWith("$"))
            {
                try 
                {
                    // Translated comment.
                    isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
                }
                catch 
                {
                    // Translated comment.
                    isPasswordValid = (user.PasswordHash == password);
                }
            }
            else
            {
                // Translated comment.
                // Translated comment.
                isPasswordValid = (user.PasswordHash == password);
            }

            if (!isPasswordValid) return null;

            return user;
        }

        // Translated comment.
        public async Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto model)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.FullName = model.FullName;
            user.PhoneNumber = model.PhoneNumber;

            await _context.SaveChangesAsync();
            return true;
        }

        // Translated comment.
        public async Task<bool> UpdateProfileImageAsync(int userId, byte[] imageBytes)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.ProfileImage = imageBytes;
            await _context.SaveChangesAsync();
            return true;
        }

        // Translated comment.
        public async Task<string> ChangePasswordAsync(int userId, ChangePasswordDto model)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return "Kullanıcı bulunamadı.";

            // Translated comment.
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

            // Translated comment.
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            
            user.PasswordHash = passwordHash;
            user.IsTemporaryPassword = false;
            user.PasswordExpiresAt = null;

            await _context.SaveChangesAsync();
            return "OK";
        }
        // Translated comment.
        public async Task<byte[]?> GetProfileImageAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user?.ProfileImage;
        }
    }
}