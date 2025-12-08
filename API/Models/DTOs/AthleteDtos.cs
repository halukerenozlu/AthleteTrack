namespace API.Models.DTOs
{
    // Sporcu eklerken Frontend'den gelecek veriler
    public class CreateAthleteDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int? JerseyNumber { get; set; }
        public int Height { get; set; }
        public double Weight { get; set; }
        public string? Phone { get; set; }
        
        public int TeamId { get; set; } // Hangi takıma ekliyoruz?
        public int PositionId { get; set; } // Mevkisi ne? (Kaleci, Forvet...)
        
        public DateTime BirthDate { get; set; }
    }

    // Listelerken Frontend'e göndereceğimiz veriler
    public class AthleteResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int? JerseyNumber { get; set; }
        public string Position { get; set; } = string.Empty; // "Forvet" yazısı
        public string TeamName { get; set; } = string.Empty;
        public int Age { get; set; } // Doğum tarihinden yaş hesaplayacağız
        public bool HasImage { get; set; } // Resmi var mı? (Varsa API'den çekeceğiz)
        public int Height { get; set; }
        public double Weight { get; set; }
        public string? Phone { get; set; }
        public DateTime BirthDate { get; set; }
    }
}