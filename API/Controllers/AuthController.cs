using API.Models.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var user = await _authService.LoginAsync(request.Email, request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Email veya şifre hatalı!" });
            }

            // Login successful; return user details to the frontend.
            // These values are used in the React sidebar.
            return Ok(new
            {
                id = user.Id,
                username = user.Username,
                fullName = user.FullName,
                role = user.Role,
                email = user.Email, 
                // NEW: Frontend uses this flag to show the yellow warning box.
                isTemporaryPassword = user.IsTemporaryPassword,
                message = "Giriş başarılı"
            });
        }
    
    [HttpPut("update-profile/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileDto model)
        {
            var result = await _authService.UpdateProfileAsync(id, model);
            if (!result) return NotFound("Kullanıcı bulunamadı.");
            
            return Ok(new { message = "Profil başarıyla güncellendi." });
        }

        [HttpPost("change-password/{id}")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDto model)
        {

            // NEW: Simple password rule
            if (model.NewPassword.Length < 6)
                return BadRequest(new { message = "Yeni şifre en az 6 karakter olmalıdır." });


            var result = await _authService.ChangePasswordAsync(id, model);
            
            if (result != "OK")
                return BadRequest(new { message = result });

            return Ok(new { message = "Şifreniz başarıyla değiştirildi." });
        }






[HttpPost("upload-photo/{id}")]
        public async Task<IActionResult> UploadPhoto(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Lütfen bir dosya seçin." });

            // 2MB file size limit check
            if (file.Length > 2 * 1024 * 1024)
                return BadRequest(new { message = "Dosya boyutu 2MB'dan büyük olamaz." });

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                
                // Call service layer method to persist data in the database.
                // (Implemented in AuthService.)
                var result = await _authService.UpdateProfileImageAsync(id, memoryStream.ToArray());
                
                if (!result) return NotFound("Kullanıcı bulunamadı.");
            }

            return Ok(new { message = "Profil fotoğrafı güncellendi." });
        }

        [HttpGet("profile-image/{id}")]
        public async Task<IActionResult> GetProfileImage(int id)
        {
            var imageBytes = await _authService.GetProfileImageAsync(id);
            
            if (imageBytes == null || imageBytes.Length == 0)
                return NotFound(); // Return 404 when no image exists

            // Return image file to the browser
            return File(imageBytes, "image/jpeg");
        }

    
    
    }
}
