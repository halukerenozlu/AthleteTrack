using Microsoft.EntityFrameworkCore;
using API.Models.Entities;

namespace API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        
        // Translated comment.
        public DbSet<Team> Teams { get; set; } = null!;
        public DbSet<Position> Positions { get; set; } = null!;
        public DbSet<InjuryType> InjuryTypes { get; set; } = null!;
        public DbSet<TrainingType> TrainingTypes { get; set; } = null!;
        
        // Translated comment.
        public DbSet<Athlete> Athletes { get; set; } = null!;
        public DbSet<Training> Trainings { get; set; } = null!;
        public DbSet<Injury> Injuries { get; set; } = null!;
        public DbSet<Match> Matches { get; set; } = null!;
        
        // Translated comment.
        public DbSet<TrainingAttendance> TrainingAttendances { get; set; } = null!;
        public DbSet<MatchStatistic> MatchStatistics { get; set; } = null!;

        // Translated comment.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Translated comment.
            // Translated comment.
            // Translated comment.
            
            modelBuilder.Entity<TrainingAttendance>()
                .HasOne(t => t.Training)
                .WithMany(t => t.TrainingAttendances) // Translated comment.
                .HasForeignKey(t => t.TrainingId)
                .OnDelete(DeleteBehavior.Restrict);

            // Translated comment.
            // Translated comment.
            modelBuilder.Entity<TrainingAttendance>()
                .HasOne(a => a.Athlete)
                .WithMany()
                .HasForeignKey(a => a.AthleteId)
                .OnDelete(DeleteBehavior.Restrict);

            // Translated comment.
            modelBuilder.Entity<MatchStatistic>()
                .HasOne(m => m.Match)
                .WithMany()
                .HasForeignKey(m => m.MatchId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MatchStatistic>()
                .HasOne(a => a.Athlete)
                .WithMany()
                .HasForeignKey(a => a.AthleteId)
                .OnDelete(DeleteBehavior.Restrict); 
        }
        // Translated comment.
    }
}