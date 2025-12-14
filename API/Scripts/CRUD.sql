-- =============================================
-- SPORCU YÖNETİMİ (ATHLETES)
-- =============================================

-- 1. Yeni Sporcu Ekleme (CREATE)
INSERT INTO Athletes (FirstName, LastName, JerseyNumber, BirthDate, Height, Weight, Phone, TeamId, PositionId, CreatedAt)
VALUES ('Arda', 'Güler', 10, '2005-02-25', 176, 70, '05551112233', 2, 8, GETDATE());

-- 2. Tüm Sporcuları Listeleme (READ)
SELECT A.FirstName, A.LastName, T.Name AS Takim, P.Name AS Mevki
FROM Athletes A
JOIN Teams T ON A.TeamId = T.Id
JOIN Positions P ON A.PositionId = P.Id;

-- 3. Sporcunun Bilgilerini Güncelleme (UPDATE)
-- Örn: Kilosu değişti ve telefonunu güncelledi
UPDATE Athletes
SET Weight = 72, Phone = '05559998877'
WHERE Id = 1;

-- 4. Sporcuyu Silme (DELETE)
DELETE FROM Athletes WHERE Id = 5;

-- 5. Belirli Bir Takımdaki Sporcuları Bulma (FILTERING)
SELECT * FROM Athletes WHERE TeamId = (SELECT Id FROM Teams WHERE Name = 'U19 Akademi');


-- =============================================
-- TAKIM YÖNETİMİ (TEAMS)
-- =============================================

-- 6. Yeni Takım Oluşturma (CREATE)
INSERT INTO Teams (Name, Category, CoachId, CreatedAt)
VALUES ('U14 Gelişim', 'Altyapı', 1, GETDATE());

-- 7. Takım İsmini Değiştirme (UPDATE)
UPDATE Teams
SET Name = 'U15 Elit Akademi'
WHERE Name = 'U14 Gelişim';

-- 8. Hocaya Ait Takımları Getirme (READ)
SELECT * FROM Teams WHERE CoachId = 1;


-- =============================================
-- ANTRENMAN VE YOKLAMA (TRAININGS & ATTENDANCE)
-- =============================================

-- 9. Yeni Antrenman Planlama (CREATE)
INSERT INTO Trainings (Date, DurationMinutes, Notes, TeamId, TrainingTypeId, CreatedAt)
VALUES ('2025-12-15 17:00:00', 90, 'Maç taktiği çalışılacak', 2, 2, GETDATE());

-- 10. Bir Antrenmanın Yoklamasını Alma (CREATE - Çoklu Ekleme)
-- ID'si 10 olan antrenmana, 1 ve 2 nolu sporcuların katıldığını ekle
INSERT INTO TrainingAttendances (TrainingId, AthleteId, IsPresent, PerformanceRating)
VALUES 
(10, 1, 1, 8),
(10, 2, 1, 9);

-- 11. Antrenman Notunu Güncelleme (UPDATE)
UPDATE Trainings 
SET Notes = 'Yağmur nedeniyle salon antrenmanı yapıldı' 
WHERE Id = 10;

-- 12. Bir Oyuncunun Antrenman Puanını Değiştirme (UPDATE)
UPDATE TrainingAttendances
SET PerformanceRating = 10
WHERE TrainingId = 10 AND AthleteId = 1;


-- =============================================
-- SAĞLIK VE SAKATLIK (INJURIES)
-- =============================================

-- 13. Yeni Sakatlık Kaydı Girme (CREATE)
INSERT INTO Injuries (InjuryDate, IsActive, Notes, AthleteId, InjuryTypeId)
VALUES (GETDATE(), 1, 'Antrenmanda darbe aldı', 1, 4);

-- 14. Sakatlığı "İyileşti" Olarak İşaretleme (UPDATE)
-- IsActive = 0 yaparak pasife çekiyoruz
UPDATE Injuries
SET IsActive = 0, ExpectedReturnDate = GETDATE()
WHERE Id = 3;

-- 15. Hatalı Girilen Sakatlık Kaydını Silme (DELETE)
DELETE FROM Injuries WHERE Id = 3;