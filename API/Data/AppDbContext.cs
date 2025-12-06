using Microsoft.EntityFrameworkCore;
using API.Models.Entities;

namespace API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Veritabanı tabloların burada tanımlanacak
        // Şimdilik yorum satırı yapıyoruz, Entityleri oluşturunca açacağız.
        
        public DbSet<User> Users { get; set; }= default!;
        // public DbSet<Athlete> Athletes { get; set; }= default!;
    }
}