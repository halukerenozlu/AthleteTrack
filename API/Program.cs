
using Microsoft.EntityFrameworkCore; // Required for UseSqlServer
using API.Data;                      // Required for AppDbContext


var builder = WebApplication.CreateBuilder(args);

// Add database connection services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// -------------------

// Register services (Dependency Injection)
builder.Services.AddScoped<API.Services.AuthService>();
builder.Services.AddScoped<API.Services.TeamService>();
builder.Services.AddScoped<API.Services.AthleteService>();
builder.Services.AddScoped<API.Services.TrainingService>();
builder.Services.AddScoped<API.Services.InjuryService>();
builder.Services.AddScoped<API.Services.DashboardService>();
builder.Services.AddScoped<API.Services.MatchService>();
builder.Services.AddScoped<API.Services.MatchStatService>();

// 1. Add controller support
builder.Services.AddControllers();

// 2. Add Swagger/OpenAPI support for API testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 


// --- ADDED SECTION (CORS CONFIGURATION) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.AllowAnyOrigin() // For now, allow all origins in development
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});
// ------------------------------------




var app = builder.Build();

// 3. Enable Swagger in development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- ADD THIS LINE TOO (Order matters: must be before UseAuthorization) ---
app.UseCors("AllowReactApp");
// -----------------------------------------------------------------------------


app.UseAuthorization();

// 4. Map controllers
app.MapControllers();

app.Run();
