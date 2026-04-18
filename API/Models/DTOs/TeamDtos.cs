namespace API.Models.DTOs
{
    // Translated comment.
    public class CreateTeamDto
    {
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Translated comment.
        public int CoachId { get; set; } // Translated comment.
    }

    // Translated comment.
    public class TeamResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int PlayerCount { get; set; } // Translated comment.
    }
}
