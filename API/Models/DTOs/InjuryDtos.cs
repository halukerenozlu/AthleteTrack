namespace API.Models.DTOs
{
    // Sakatlık Eklerken Gelen Veri
    public class CreateInjuryDto
    {
        public int AthleteId { get; set; } // Kim sakatlandı?
        public int InjuryTypeId { get; set; } // Ne oldu? (Kırık, Çekme...)
        public DateTime InjuryDate { get; set; } // Ne zaman?
        public DateTime? ExpectedReturnDate { get; set; } // Tahmini dönüş (Opsiyonel)
        public string? Notes { get; set; } // Doktor notu
    }

    // Listelerken Göndereceğimiz Veri
    public class InjuryResponseDto
    {
        public int Id { get; set; }
        public string AthleteName { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;
        public byte[]? AthleteImage { get; set; } // Profil resmi (göstermek için)
        public string InjuryTypeName { get; set; } = string.Empty;
        public DateTime InjuryDate { get; set; }
        public DateTime? ExpectedReturnDate { get; set; }
        public bool IsActive { get; set; } // Hala sakat mı?
        public string? Notes { get; set; }
    }
}