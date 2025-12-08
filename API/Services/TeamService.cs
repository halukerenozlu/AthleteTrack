using API.Data;
using API.Models.Entities;
using API.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class TeamService
    {
        private readonly AppDbContext _context;

        public TeamService(AppDbContext context)
        {
            _context = context;
        }

        // 1. BELİRLİ BİR HOCANIN TAKIMLARINI GETİR
        public async Task<List<TeamResponseDto>> GetTeamsByCoachAsync(int coachId)
        {
            var teams = await _context.Teams
                .Where(t => t.CoachId == coachId) // Güvenlik: Sadece bu hocanın takımları!
                .Include(t => t.Athletes) // Oyuncu sayısını saymak için ilişkili tabloyu dahil et
                .Select(t => new TeamResponseDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Category = t.Category,
                    PlayerCount = t.Athletes.Count() // Otomatik sayım (Count)
                })
                .ToListAsync();

            return teams;
        }

        // 2. YENİ TAKIM EKLE
        public async Task<bool> AddTeamAsync(CreateTeamDto model)
        {
            var newTeam = new Team
            {
                Name = model.Name,
                Category = model.Category,
                CoachId = model.CoachId,
                CreatedAt = DateTime.Now
            };

            _context.Teams.Add(newTeam);
            await _context.SaveChangesAsync();
            return true;
        }

        // 3. TAKIM SİL
        public async Task<bool> DeleteTeamAsync(int teamId)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return false;

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();
            return true;
        }

        // 4. TAKIM GÜNCELLE
        public async Task<bool> UpdateTeamAsync(int id, CreateTeamDto model)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null) return false;

            team.Name = model.Name;
            team.Category = model.Category;
            
            await _context.SaveChangesAsync();
            return true;
        }
    }
}