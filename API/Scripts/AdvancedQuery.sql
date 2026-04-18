### 📂 Bölüm 1: Yönetimsel Sorgular (Admin İşlemleri)

-- Translated comment.

INSERT INTO Users (Username, Email, PasswordHash, FullName, Role, IsTemporaryPassword, PasswordExpiresAt, IsActive, CreatedAt)
VALUES 
('yenihoca', 'yeni@athletetrack.com', '123456', 'Yeni Hoca', 'Coach', 1, '2025-12-31', 1, GETDATE());


-- Translated comment.

UPDATE Users SET IsActive = 0 WHERE Email = 'haluk@athletetrack.com';


-- Translated comment.

UPDATE Users 
SET PasswordExpiresAt = DATEADD(day, 7, GETDATE()) 
WHERE Username = 'keremhoca';


-- Translated comment.

SELECT Id, FullName, Email, CreatedAt FROM Users WHERE IsActive = 1 AND Role = 'Coach';


-- Translated comment.

INSERT INTO TrainingTypes (Name, ColorCode) VALUES ('Yoga', '#9C27B0');


-- Translated comment.

INSERT INTO InjuryTypes (Name, Description) VALUES ('Kafa Travması', 'Darbe sonucu oluşan travma');

### 📂 Bölüm 2: Operasyonel Sorgular (Günlük İşler)

-- Translated comment.

SELECT A.FirstName, A.LastName, A.JerseyNumber, P.Name AS Mevki
FROM Athletes A
JOIN Teams T ON A.TeamId = T.Id
JOIN Positions P ON A.PositionId = P.Id
WHERE T.Name = 'U19 Akademi';


-- Translated comment.

SELECT T.Name AS Takim, TR.Date, TT.Name AS Tip
FROM Trainings TR
JOIN Teams T ON TR.TeamId = T.Id
JOIN TrainingTypes TT ON TR.TrainingTypeId = TT.Id
WHERE CAST(TR.Date AS DATE) = CAST(GETDATE() AS DATE);


-- Translated comment.


SELECT I.InjuryDate, IT.Name AS SakatlikTuru, I.Notes, I.IsActive
FROM Injuries I
JOIN Athletes A ON I.AthleteId = A.Id
JOIN InjuryTypes IT ON I.InjuryTypeId = IT.Id
WHERE A.FirstName = 'Ahmet' AND A.LastName = 'Yılmaz';


-- Translated comment.

SELECT M.MatchDate, T.Name AS BizimTakim, M.Opponent AS Rakip, 
       CASE WHEN M.IsHome = 1 THEN 'İç Saha' ELSE 'Deplasman' END AS Saha
FROM Matches M
JOIN Teams T ON M.TeamId = T.Id
WHERE M.TeamScore IS NULL
ORDER BY M.MatchDate ASC;


### 📂 Bölüm 3: Analitik ve Raporlama (Gelişmiş SQL) 🧠

-- Translated comment.

-- Translated comment.

SELECT T.Name AS TakimAdi, COUNT(A.Id) AS OyuncuSayisi
FROM Teams T
LEFT JOIN Athletes A ON T.Id = A.TeamId
GROUP BY T.Name;


-- Translated comment.

SELECT P.Name AS Mevki, COUNT(I.Id) AS SakatlikSayisi
FROM Injuries I
JOIN Athletes A ON I.AthleteId = A.Id
JOIN Positions P ON A.PositionId = P.Id
GROUP BY P.Name
ORDER BY SakatlikSayisi DESC;


-- Translated comment.

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


-- Translated comment.

SELECT TOP 5 
    A.FirstName + ' ' + A.LastName AS Oyuncu,
    T.Name AS Takim,
    SUM(MS.Goals) AS ToplamGol
FROM MatchStatistics MS
JOIN Athletes A ON MS.AthleteId = A.Id
JOIN Teams T ON A.TeamId = T.Id
GROUP BY A.FirstName, A.LastName, T.Name
ORDER BY ToplamGol DESC;


-- Translated comment.

SELECT T.Name AS Takim, AVG(M.TeamScore) AS OrtalamaGol
FROM Matches M
JOIN Teams T ON M.TeamId = T.Id
WHERE M.TeamScore IS NOT NULL
GROUP BY T.Name;

-- Translated comment.


SELECT P.Name AS Mevki, 
       AVG(A.Weight / ((A.Height / 100.0) * (A.Height / 100.0))) AS OrtalamaVKE
FROM Athletes A
JOIN Positions P ON A.PositionId = P.Id
WHERE A.Height > 0 AND A.Weight > 0
GROUP BY P.Name;


-- Translated comment.


- En çok koşan oyuncular (DistanceCovered)
SELECT TOP 3 A.FirstName, SUM(MS.DistanceCovered) AS ToplamKosuKM
FROM MatchStatistics MS
JOIN Athletes A ON MS.AthleteId = A.Id
GROUP BY A.FirstName
ORDER BY ToplamKosuKM DESC;

-- Translated comment.

SELECT A.FirstName, IT.Name, DATEDIFF(day, I.InjuryDate, ISNULL(I.ExpectedReturnDate, GETDATE())) AS GunSuresi
FROM Injuries I
JOIN Athletes A ON I.AthleteId = A.Id
JOIN InjuryTypes IT ON I.InjuryTypeId = IT.Id
WHERE DATEDIFF(day, I.InjuryDate, ISNULL(I.ExpectedReturnDate, GETDATE())) > 30;


-- Translated comment.

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


-- Translated comment.

SELECT TOP 1 A.FirstName, AVG(TA.PerformanceRating) AS OrtPuan
FROM TrainingAttendances TA
JOIN Athletes A ON TA.AthleteId = A.Id
WHERE TA.PerformanceRating IS NOT NULL
GROUP BY A.FirstName
ORDER BY OrtPuan DESC;



### 📂 Bölüm 4: Veritabanı Bakım ve Kontrol Sorguları

-- Translated comment.


SELECT * FROM Athletes WHERE TeamId IS NULL;


-- Translated comment.

SELECT T.Name 
FROM Teams T
LEFT JOIN Trainings TR ON T.Id = TR.TeamId
WHERE TR.Id IS NULL;

-- Translated comment.

SELECT TeamId, Date, COUNT(*) AS IdmanSayisi
FROM Trainings
GROUP BY TeamId, Date
HAVING COUNT(*) > 1;


-- Translated comment.


SELECT t.NAME AS TableName, i.rowcnt AS RowCounts
FROM sysindexes AS i
INNER JOIN sysobjects AS t ON i.id = t.id
WHERE i.indid < 2  AND OBJECTPROPERTY(t.id, 'IsUserTable') = 1
ORDER BY i.rowcnt DESC;


-- Translated comment.

SELECT 'Athlete' as Tip, CreatedAt FROM Athletes WHERE CreatedAt > DATEADD(day, -1, GETDATE())
UNION ALL
SELECT 'User', CreatedAt FROM Users WHERE CreatedAt > DATEADD(day, -1, GETDATE());


### 📂 Bölüm 5: Özel İhtiyaç Sorguları (Senaryo Bazlı)

-- Translated comment.

SELECT * FROM Athletes WHERE PositionId = (SELECT Id FROM Positions WHERE Name = 'Sol Bek');

-- Translated comment.

SELECT FirstName, BirthDate, DATEDIFF(hour, BirthDate, GETDATE())/8766 AS Yas
FROM Athletes
WHERE DATEDIFF(hour, BirthDate, GETDATE())/8766 < 18;


-- Translated comment.

SELECT DATENAME(dw, Date) AS Gun, COUNT(*) AS Sayi
FROM Trainings
GROUP BY DATENAME(dw, Date)
ORDER BY Sayi DESC;


-- Translated comment.

SELECT TOP 1 T.Name, COUNT(I.Id) as SakatlikSayisi
FROM Injuries I
JOIN Athletes A ON I.AthleteId = A.Id
JOIN Teams T ON A.TeamId = T.Id
GROUP BY T.Name
ORDER BY SakatlikSayisi DESC;

-- Translated comment.

SQL
- DELETE FROM MatchStatistics;
- DELETE FROM Matches;
- DELETE FROM TrainingAttendances;
- DELETE FROM Trainings;
- DELETE FROM Injuries;
- DELETE FROM Athletes;
