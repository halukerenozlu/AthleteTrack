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
        
        // Core tables
        public DbSet<Team> Teams { get; set; } = null!;
        public DbSet<Position> Positions { get; set; } = null!;
        public DbSet<InjuryType> InjuryTypes { get; set; } = null!;
        public DbSet<TrainingType> TrainingTypes { get; set; } = null!;
        
        // Main tables
        public DbSet<Athlete> Athletes { get; set; } = null!;
        public DbSet<Training> Trainings { get; set; } = null!;
        public DbSet<Injury> Injuries { get; set; } = null!;
        public DbSet<Match> Matches { get; set; } = null!;
        
        // Detail tables
        public DbSet<TrainingAttendance> TrainingAttendances { get; set; } = null!;
        public DbSet<MatchStatistic> MatchStatistics { get; set; } = null!;

        // --- ADDED: SECTION TO RESOLVE CASCADE DELETE ISSUES ---
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- FIX APPLIED HERE ---
            // In Training, TrainingAttendances is a collection,
            // so .WithMany() should not be left empty.
            
            modelBuilder.Entity<TrainingAttendance>()
                .HasOne(t => t.Training)
                .WithMany(t => t.TrainingAttendances) // <-- FIX: Explicit collection mapping
                .HasForeignKey(t => t.TrainingId)
                .OnDelete(DeleteBehavior.Restrict);

            // Athlete does not define an attendance collection,
            // so .WithMany() can remain empty.
            modelBuilder.Entity<TrainingAttendance>()
                .HasOne(a => a.Athlete)
                .WithMany()
                .HasForeignKey(a => a.AthleteId)
                .OnDelete(DeleteBehavior.Restrict);

            // MatchStatistic configuration can remain as-is
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
        // -----------------------------------------------------------
    }
}
