namespace API.Models.DTOs
{
    // 1. Frontend'den takım eklerken gelen veri
    public class CreateTeamDto
    {
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // U19, A Takım vb.
        public int CoachId { get; set; } // Hangi hocaya ait?
    }

    // 2. Frontend'e listelerken göndereceğimiz veri (Cevap)
    public class TeamResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int PlayerCount { get; set; } // Bu takımda kaç oyuncu var? (Bonus özellik)
    }
}