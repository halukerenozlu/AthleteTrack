using API.Data;
using API.Models.Entities;
using API.Models.DTOs;
using Microsoft.EntityFrameworkCore;
// using BCrypt.Net; // Removed: not required

namespace API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        // --- LOGIN FLOW (HYBRID CHECK) ---
        public async Task<User?> LoginAsync(string email, string password)
        {
            // 1. Fetch user via stored procedure
            var userList = await _context.Users
                .FromSqlRaw("EXEC sp_CheckUserLogin @Email = {0}", email)
                .ToListAsync();

            var user = userList.FirstOrDefault();

            if (user == null) return null;

            // If the account is inactive, skip password validation.
                 if (!user.IsActive) 
                     return null; // Or throw a custom error


            // 2. PASSWORD VALIDATION (CRITICAL) 🛡️
            bool isPasswordValid = false;

            // If the database password is a hash (usually starts with $)
            if (user.PasswordHash.StartsWith("$"))
            {
                try 
                {
                    // Verify hash
                    isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
                }
                catch 
                {
                    // If hash is invalid, try plaintext comparison (fallback)
                    isPasswordValid = (user.PasswordHash == password);
                }
            }
            else
            {
                // If password does not start with "$...", treat it as plain text (e.g., "123456")
                // Perform direct equality check
                isPasswordValid = (user.PasswordHash == password);
            }

            if (!isPasswordValid) return null;

            return user;
        }

        // --- UPDATE PROFILE ---
        public async Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto model)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.FullName = model.FullName;
            user.PhoneNumber = model.PhoneNumber;

            await _context.SaveChangesAsync();
            return true;
        }

        // --- UPDATE PROFILE PHOTO ---
        public async Task<bool> UpdateProfileImageAsync(int userId, byte[] imageBytes)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.ProfileImage = imageBytes;
            await _context.SaveChangesAsync();
            return true;
        }

        // --- CHANGE PASSWORD ---
        public async Task<string> ChangePasswordAsync(int userId, ChangePasswordDto model)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return "Kullanıcı bulunamadı.";

            // 1. Validate current password (hybrid check to avoid errors)
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

            // 2. Hash and save the new password
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            
            user.PasswordHash = passwordHash;
            user.IsTemporaryPassword = false;
            user.PasswordExpiresAt = null;

            await _context.SaveChangesAsync();
            return "OK";
        }
        // FETCH PROFILE IMAGE METHOD
        public async Task<byte[]?> GetProfileImageAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user?.ProfileImage;
        }
    }
}
