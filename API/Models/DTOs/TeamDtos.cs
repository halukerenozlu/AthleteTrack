namespace API.Models.DTOs
{
    // 1. Incoming payload when creating a team from frontend
    public class CreateTeamDto
    {
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // U19, A Team, etc.
        public int CoachId { get; set; } // Assigned coach
    }

    // 2. Response payload for frontend team listing
    public class TeamResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int PlayerCount { get; set; } // Number of players in the team
    }
}
