
using Microsoft.EntityFrameworkCore; // (UseSqlServer için)
using API.Data;                      // (AppDbContext'i bulması için)


var builder = WebApplication.CreateBuilder(args);

// Veritabanı bağlantısını servislere ekliyoruz
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// -------------------

// Servisleri Tanıtıyoruz (Dependency Injection)
builder.Services.AddScoped<API.Services.AuthService>();
builder.Services.AddScoped<API.Services.TeamService>();
builder.Services.AddScoped<API.Services.AthleteService>();
builder.Services.AddScoped<API.Services.TrainingService>();
builder.Services.AddScoped<API.Services.InjuryService>();

// 1. Controller desteğini ekle (Bizim mimari için şart)
builder.Services.AddControllers();

// 2. Swagger/OpenAPI desteği (API'yi test etmek için)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 


// --- EKLENECEK KISIM (CORS AYARI) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.AllowAnyOrigin() // Şimdilik herkese izin veriyoruz (Geliştirme için)
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});
// ------------------------------------




var app = builder.Build();

// 3. Geliştirme ortamındaysak Swagger'ı aç
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- BU SATIRI DA EKLE (Sıralama Önemli: UseAuthorization'dan ÖNCE olmalı) ---
app.UseCors("AllowReactApp");
// -----------------------------------------------------------------------------


app.UseAuthorization();

// 4. Controller'ları haritala (Controllers klasöründeki dosyaları çalıştırır)
app.MapControllers();

app.Run();