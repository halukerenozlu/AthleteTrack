### 📂 Bölüm 1: Yönetimsel Sorgular (Admin İşlemleri)

-- 1. Yeni Antrenör (Kullanıcı) Ekleme***(Sisteme giriş yapabilen yeni bir hoca tanımlar)

INSERT INTO Users (Username, Email, PasswordHash, FullName, Role, IsTemporaryPassword, PasswordExpiresAt, IsActive, CreatedAt)
VALUES 
('yenihoca', 'yeni@athletetrack.com', '123456', 'Yeni Hoca', 'Coach', 1, '2025-12-31', 1, GETDATE());


-- 2. Bir Kullanıcıyı Pasife Alma (Soft Delete)***(Hesabı silmeden giriş yapmasını engeller)

UPDATE Users SET IsActive = 0 WHERE Email = 'haluk@athletetrack.com';


-- 3. Geçici Şifre Süresini Uzatma***(Şifresi dolan bir hocaya ek süre verir)

UPDATE Users 
SET PasswordExpiresAt = DATEADD(day, 7, GETDATE()) 
WHERE Username = 'keremhoca';


-- 4. Sistemdeki Tüm Aktif Antrenörleri Listele

SELECT Id, FullName, Email, CreatedAt FROM Users WHERE IsActive = 1 AND Role = 'Coach';


-- 5. Yeni Bir Antrenman Tipi Tanımlama***(Sisteme "Yoga" antrenmanı ekler)

INSERT INTO TrainingTypes (Name, ColorCode) VALUES ('Yoga', '#9C27B0');


-- 6. Yeni Bir Sakatlık Türü Ekleme

INSERT INTO InjuryTypes (Name, Description) VALUES ('Kafa Travması', 'Darbe sonucu oluşan travma');

### 📂 Bölüm 2: Operasyonel Sorgular (Günlük İşler)

-- 7. Bir Takımın Tüm Oyuncularını Listele***(U19 takımındaki oyuncuların temel bilgileri)

SELECT A.FirstName, A.LastName, A.JerseyNumber, P.Name AS Mevki
FROM Athletes A
JOIN Teams T ON A.TeamId = T.Id
JOIN Positions P ON A.PositionId = P.Id
WHERE T.Name = 'U19 Akademi';


-- 8. Belirli Bir Tarihteki Antrenmanları Bul***(Bugün hangi takımların idmanı var?)

SELECT T.Name AS Takim, TR.Date, TT.Name AS Tip
FROM Trainings TR
JOIN Teams T ON TR.TeamId = T.Id
JOIN TrainingTypes TT ON TR.TrainingTypeId = TT.Id
WHERE CAST(TR.Date AS DATE) = CAST(GETDATE() AS DATE);


-- 9. Bir Oyuncunun Sakatlık Geçmişi***(Ahmet'in bugüne kadar geçirdiği sakatlıklar)


SELECT I.InjuryDate, IT.Name AS SakatlikTuru, I.Notes, I.IsActive
FROM Injuries I
JOIN Athletes A ON I.AthleteId = A.Id
JOIN InjuryTypes IT ON I.InjuryTypeId = IT.Id
WHERE A.FirstName = 'Ahmet' AND A.LastName = 'Yılmaz';


-- 10. Gelecek Maç Fikstürü***(Oynanmamış, planlanan maçlar)*

SELECT M.MatchDate, T.Name AS BizimTakim, M.Opponent AS Rakip, 
       CASE WHEN M.IsHome = 1 THEN 'İç Saha' ELSE 'Deplasman' END AS Saha
FROM Matches M
JOIN Teams T ON M.TeamId = T.Id
WHERE M.TeamScore IS NULL
ORDER BY M.MatchDate ASC;


### 📂 Bölüm 3: Analitik ve Raporlama (Gelişmiş SQL) 🧠

*(Hocanın en çok puan vereceği kısım burasıdır)*

-- 11. Takımlara Göre Oyuncu Sayısı Dağılımı (GROUP BY)***(Hangi takımda kaç oyuncu var?)

SELECT T.Name AS TakimAdi, COUNT(A.Id) AS OyuncuSayisi
FROM Teams T
LEFT JOIN Athletes A ON T.Id = A.TeamId
GROUP BY T.Name;


-- 12. En Çok Sakatlık Yaşanan Mevkiler***(Hangi mevkideki oyuncular daha çok sakatlanıyor?)*

SELECT P.Name AS Mevki, COUNT(I.Id) AS SakatlikSayisi
FROM Injuries I
JOIN Athletes A ON I.AthleteId = A.Id
JOIN Positions P ON A.PositionId = P.Id
GROUP BY P.Name
ORDER BY SakatlikSayisi DESC;


-- 13. Antrenman Katılım Oranı (COMPLEX JOIN)***(Oyuncuların antrenmana gelme yüzdesi - %80 altı riskli)*

SELECT 
    A.FirstName + ' ' + A.LastName AS Oyuncu,
    COUNT(TA.Id) AS ToplamIdman,
    SUM(CASE WHEN TA.IsPresent = 1 THEN 1 ELSE 0 END) AS Katildigi,
    (CAST(SUM(CASE WHEN TA.IsPresent = 1 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(TA.Id)) * 100 AS KatilimOrani
FROM TrainingAttendances TA
JOIN Athletes A ON TA.AthleteId = A.Id
GROUP BY A.FirstName, A.LastName, A.Id
HAVING COUNT(TA.Id) > 0
ORDER BY KatilimOrani DESC;


-- 14. Gol Krallığı (Top Scorers)***(Tüm takımlar genelinde en çok gol atan 5 oyuncu)*

SELECT TOP 5 
    A.FirstName + ' ' + A.LastName AS Oyuncu,
    T.Name AS Takim,
    SUM(MS.Goals) AS ToplamGol
FROM MatchStatistics MS
JOIN Athletes A ON MS.AthleteId = A.Id
JOIN Teams T ON A.TeamId = T.Id
GROUP BY A.FirstName, A.LastName, T.Name
ORDER BY ToplamGol DESC;


-- 15. Takımın Maç Başına Ortalama Gol Sayısı (AVG)***(Hücum gücü analizi)*

SELECT T.Name AS Takim, AVG(M.TeamScore) AS OrtalamaGol
FROM Matches M
JOIN Teams T ON M.TeamId = T.Id
WHERE M.TeamScore IS NOT NULL
GROUP BY T.Name;

-- 16. Mevkilerin Vücut Kitle İndeksi (VKE) Ortalaması***(Hangi mevki daha yapılı?)*


SELECT P.Name AS Mevki, 
       AVG(A.Weight / ((A.Height / 100.0) * (A.Height / 100.0))) AS OrtalamaVKE
FROM Athletes A
JOIN Positions P ON A.PositionId = P.Id
WHERE A.Height > 0 AND A.Weight > 0
GROUP BY P.Name;


-- 17. En Agresif Takım (Sarı/Kırmızı Kart Analizi)***(MatchStats tablosuna kart sütunu eklenirse kullanılabilir, şimdilik faul/koşu gibi düşünelim)*


- En çok koşan oyuncular (DistanceCovered)
SELECT TOP 3 A.FirstName, SUM(MS.DistanceCovered) AS ToplamKosuKM
FROM MatchStatistics MS
JOIN Athletes A ON MS.AthleteId = A.Id
GROUP BY A.FirstName
ORDER BY ToplamKosuKM DESC;

-- 18. Uzun Süreli Sakatlıklar***(30 günden fazla süren sakatlıklar)*

SELECT A.FirstName, IT.Name, DATEDIFF(day, I.InjuryDate, ISNULL(I.ExpectedReturnDate, GETDATE())) AS GunSuresi
FROM Injuries I
JOIN Athletes A ON I.AthleteId = A.Id
JOIN InjuryTypes IT ON I.InjuryTypeId = IT.Id
WHERE DATEDIFF(day, I.InjuryDate, ISNULL(I.ExpectedReturnDate, GETDATE())) > 30;


-- 19. Son 5 Maçın Sonuçları***(Galibiyet/Mağlubiyet durumu)*

SELECT MatchDate, Opponent, 
       CASE 
           WHEN TeamScore > OpponentScore THEN 'Galibiyet'
           WHEN TeamScore < OpponentScore THEN 'Mağlubiyet'
           ELSE 'Beraberlik'
       END AS Sonuc
FROM Matches
WHERE TeamScore IS NOT NULL
ORDER BY MatchDate DESC
OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY;


-- 20. Antrenman Performans Puanı En Yüksek Oyuncu***(İdmanlarda en çalışkan oyuncu)*

SELECT TOP 1 A.FirstName, AVG(TA.PerformanceRating) AS OrtPuan
FROM TrainingAttendances TA
JOIN Athletes A ON TA.AthleteId = A.Id
WHERE TA.PerformanceRating IS NOT NULL
GROUP BY A.FirstName
ORDER BY OrtPuan DESC;



### 📂 Bölüm 4: Veritabanı Bakım ve Kontrol Sorguları

-- 21. Takımı Olmayan Oyuncuları Bul (Data Integrity Check


SELECT * FROM Athletes WHERE TeamId IS NULL;


-- 22. Hiç İdman Yapmamış Takımlar

SELECT T.Name 
FROM Teams T
LEFT JOIN Trainings TR ON T.Id = TR.TeamId
WHERE TR.Id IS NULL;

-- 23. Aynı Gün Çift İdman Yapan Takımlar (Çakışma Kontrolü)

SELECT TeamId, Date, COUNT(*) AS IdmanSayisi
FROM Trainings
GROUP BY TeamId, Date
HAVING COUNT(*) > 1;


-- 24. Veritabanı Boyutu ve Tablo Satır Sayıları**


SELECT t.NAME AS TableName, i.rowcnt AS RowCounts
FROM sysindexes AS i
INNER JOIN sysobjects AS t ON i.id = t.id
WHERE i.indid < 2  AND OBJECTPROPERTY(t.id, 'IsUserTable') = 1
ORDER BY i.rowcnt DESC;


-- 25. Son 24 Saatte Sisteme Eklenen Veriler

SELECT 'Athlete' as Tip, CreatedAt FROM Athletes WHERE CreatedAt > DATEADD(day, -1, GETDATE())
UNION ALL
SELECT 'User', CreatedAt FROM Users WHERE CreatedAt > DATEADD(day, -1, GETDATE());


### 📂 Bölüm 5: Özel İhtiyaç Sorguları (Senaryo Bazlı)

-- 26. Mevkiye Göre Oyuncu Arama *(Sadece 'Sol Bek' oyuncularını getir)*

SELECT * FROM Athletes WHERE PositionId = (SELECT Id FROM Positions WHERE Name = 'Sol Bek');

-- 27. Belirli Bir Yaşın Altındaki Oyuncular (Genç Yetenekler)

SELECT FirstName, BirthDate, DATEDIFF(hour, BirthDate, GETDATE())/8766 AS Yas
FROM Athletes
WHERE DATEDIFF(hour, BirthDate, GETDATE())/8766 < 18;


-- 28. Ayın En Yoğun Antrenman Günü

SELECT DATENAME(dw, Date) AS Gun, COUNT(*) AS Sayi
FROM Trainings
GROUP BY DATENAME(dw, Date)
ORDER BY Sayi DESC;


-- 29. Sakatlık Oranı En Yüksek Takım

SELECT TOP 1 T.Name, COUNT(I.Id) as SakatlikSayisi
FROM Injuries I
JOIN Athletes A ON I.AthleteId = A.Id
JOIN Teams T ON A.TeamId = T.Id
GROUP BY T.Name
ORDER BY SakatlikSayisi DESC;

-- 30. Sistemi Sıfırla (Dikkatli Kullanın!) *(Tüm operasyonel verileri siler, tanımları tutar)*

SQL
- DELETE FROM MatchStatistics;
- DELETE FROM Matches;
- DELETE FROM TrainingAttendances;
- DELETE FROM Trainings;
- DELETE FROM Injuries;
- DELETE FROM Athletes;