
using Microsoft.EntityFrameworkCore; // Translated comment.
using API.Data;                      // Translated comment.


var builder = WebApplication.CreateBuilder(args);

// Translated comment.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Translated comment.

// Translated comment.
builder.Services.AddScoped<API.Services.AuthService>();
builder.Services.AddScoped<API.Services.TeamService>();
builder.Services.AddScoped<API.Services.AthleteService>();
builder.Services.AddScoped<API.Services.TrainingService>();
builder.Services.AddScoped<API.Services.InjuryService>();
builder.Services.AddScoped<API.Services.DashboardService>();
builder.Services.AddScoped<API.Services.MatchService>();
builder.Services.AddScoped<API.Services.MatchStatService>();

// Translated comment.
builder.Services.AddControllers();

// Translated comment.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 


// Translated comment.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.AllowAnyOrigin() // Translated comment.
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});
// Translated comment.




var app = builder.Build();

// Translated comment.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Translated comment.
app.UseCors("AllowReactApp");
// Translated comment.


app.UseAuthorization();

// Translated comment.
app.MapControllers();

app.Run();