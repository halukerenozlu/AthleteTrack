### 📂 Bölüm 1: Yönetimsel Sorgular (Admin İşlemleri)

-- 1. Add New Coach User (defines a new coach who can log in)

INSERT INTO Users (Username, Email, PasswordHash, FullName, Role, IsTemporaryPassword, PasswordExpiresAt, IsActive, CreatedAt)
VALUES 
('yenihoca', 'yeni@athletetrack.com', '123456', 'Yeni Hoca', 'Coach', 1, '2025-12-31', 1, GETDATE());


-- 2. Deactivate a User (Soft Delete) (prevents login without deleting account)

UPDATE Users SET IsActive = 0 WHERE Email = 'haluk@athletetrack.com';


-- 3. Extend Temporary Password Duration (adds extra time for expired coach password)

UPDATE Users 
SET PasswordExpiresAt = DATEADD(day, 7, GETDATE()) 
WHERE Username = 'keremhoca';


-- 4. List All Active Coaches in the System

SELECT Id, FullName, Email, CreatedAt FROM Users WHERE IsActive = 1 AND Role = 'Coach';


-- 5. Define a New Training Type (adds "Yoga" training)

INSERT INTO TrainingTypes (Name, ColorCode) VALUES ('Yoga', '#9C27B0');


-- 6. Add a New Injury Type

INSERT INTO InjuryTypes (Name, Description) VALUES ('Kafa Travması', 'Darbe sonucu oluşan travma');

### 📂 Bölüm 2: Operasyonel Sorgular (Günlük İşler)

-- 7. List All Players of a Team (basic info for U19 players)

SELECT A.FirstName, A.LastName, A.JerseyNumber, P.Name AS Mevki
FROM Athletes A
JOIN Teams T ON A.TeamId = T.Id
JOIN Positions P ON A.PositionId = P.Id
WHERE T.Name = 'U19 Akademi';


-- 8. Find Trainings on a Specific Date (which teams train today?)

SELECT T.Name AS Takim, TR.Date, TT.Name AS Tip
FROM Trainings TR
JOIN Teams T ON TR.TeamId = T.Id
JOIN TrainingTypes TT ON TR.TrainingTypeId = TT.Id
WHERE CAST(TR.Date AS DATE) = CAST(GETDATE() AS DATE);


-- 9. Athlete Injury History (injuries Ahmet has had so far)


SELECT I.InjuryDate, IT.Name AS SakatlikTuru, I.Notes, I.IsActive
FROM Injuries I
JOIN Athletes A ON I.AthleteId = A.Id
JOIN InjuryTypes IT ON I.InjuryTypeId = IT.Id
WHERE A.FirstName = 'Ahmet' AND A.LastName = 'Yılmaz';


-- 10. Upcoming Match Fixtures (unplayed, scheduled matches)

SELECT M.MatchDate, T.Name AS BizimTakim, M.Opponent AS Rakip, 
       CASE WHEN M.IsHome = 1 THEN 'İç Saha' ELSE 'Deplasman' END AS Saha
FROM Matches M
JOIN Teams T ON M.TeamId = T.Id
WHERE M.TeamScore IS NULL
ORDER BY M.MatchDate ASC;


### 📂 Bölüm 3: Analitik ve Raporlama (Gelişmiş SQL) 🧠

-- Coaches usually value this section the most.

-- 11. Player Count Distribution by Team (GROUP BY)

SELECT T.Name AS TakimAdi, COUNT(A.Id) AS OyuncuSayisi
FROM Teams T
LEFT JOIN Athletes A ON T.Id = A.TeamId
GROUP BY T.Name;


-- 12. Positions with Most Injuries

SELECT P.Name AS Mevki, COUNT(I.Id) AS SakatlikSayisi
FROM Injuries I
JOIN Athletes A ON I.AthleteId = A.Id
JOIN Positions P ON A.PositionId = P.Id
GROUP BY P.Name
ORDER BY SakatlikSayisi DESC;


-- 13. Training Attendance Rate (COMPLEX JOIN)

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


-- 14. Top Scorers (top 5 across all teams)

SELECT TOP 5 
    A.FirstName + ' ' + A.LastName AS Oyuncu,
    T.Name AS Takim,
    SUM(MS.Goals) AS ToplamGol
FROM MatchStatistics MS
JOIN Athletes A ON MS.AthleteId = A.Id
JOIN Teams T ON A.TeamId = T.Id
GROUP BY A.FirstName, A.LastName, T.Name
ORDER BY ToplamGol DESC;


-- 15. Average Goals per Match by Team (AVG)

SELECT T.Name AS Takim, AVG(M.TeamScore) AS OrtalamaGol
FROM Matches M
JOIN Teams T ON M.TeamId = T.Id
WHERE M.TeamScore IS NOT NULL
GROUP BY T.Name;

-- 16. Average BMI by Position


SELECT P.Name AS Mevki, 
       AVG(A.Weight / ((A.Height / 100.0) * (A.Height / 100.0))) AS OrtalamaVKE
FROM Athletes A
JOIN Positions P ON A.PositionId = P.Id
WHERE A.Height > 0 AND A.Weight > 0
GROUP BY P.Name;


-- 17. Most Aggressive Team (Yellow/Red Card Analysis)


- En çok koşan oyuncular (DistanceCovered)
SELECT TOP 3 A.FirstName, SUM(MS.DistanceCovered) AS ToplamKosuKM
FROM MatchStatistics MS
JOIN Athletes A ON MS.AthleteId = A.Id
GROUP BY A.FirstName
ORDER BY ToplamKosuKM DESC;

-- 18. Long-Term Injuries (longer than 30 days)

SELECT A.FirstName, IT.Name, DATEDIFF(day, I.InjuryDate, ISNULL(I.ExpectedReturnDate, GETDATE())) AS GunSuresi
FROM Injuries I
JOIN Athletes A ON I.AthleteId = A.Id
JOIN InjuryTypes IT ON I.InjuryTypeId = IT.Id
WHERE DATEDIFF(day, I.InjuryDate, ISNULL(I.ExpectedReturnDate, GETDATE())) > 30;


-- 19. Results of Last 5 Matches

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


-- 20. Athlete with Highest Training Performance Rating

SELECT TOP 1 A.FirstName, AVG(TA.PerformanceRating) AS OrtPuan
FROM TrainingAttendances TA
JOIN Athletes A ON TA.AthleteId = A.Id
WHERE TA.PerformanceRating IS NOT NULL
GROUP BY A.FirstName
ORDER BY OrtPuan DESC;



### 📂 Bölüm 4: Veritabanı Bakım ve Kontrol Sorguları

-- 21. Find Athletes Without a Team (Data Integrity Check)


SELECT * FROM Athletes WHERE TeamId IS NULL;


-- 22. Teams with No Trainings

SELECT T.Name 
FROM Teams T
LEFT JOIN Trainings TR ON T.Id = TR.TeamId
WHERE TR.Id IS NULL;

-- 23. Teams with Multiple Trainings on the Same Day (Conflict Check)

SELECT TeamId, Date, COUNT(*) AS IdmanSayisi
FROM Trainings
GROUP BY TeamId, Date
HAVING COUNT(*) > 1;


-- 24. Database Size and Table Row Counts


SELECT t.NAME AS TableName, i.rowcnt AS RowCounts
FROM sysindexes AS i
INNER JOIN sysobjects AS t ON i.id = t.id
WHERE i.indid < 2  AND OBJECTPROPERTY(t.id, 'IsUserTable') = 1
ORDER BY i.rowcnt DESC;


-- 25. Data Added in the Last 24 Hours

SELECT 'Athlete' as Tip, CreatedAt FROM Athletes WHERE CreatedAt > DATEADD(day, -1, GETDATE())
UNION ALL
SELECT 'User', CreatedAt FROM Users WHERE CreatedAt > DATEADD(day, -1, GETDATE());


### 📂 Bölüm 5: Özel İhtiyaç Sorguları (Senaryo Bazlı)

-- 26. Search Athletes by Position (only 'Left Back')

SELECT * FROM Athletes WHERE PositionId = (SELECT Id FROM Positions WHERE Name = 'Sol Bek');

-- 27. Athletes Below a Specific Age (Young Talents)

SELECT FirstName, BirthDate, DATEDIFF(hour, BirthDate, GETDATE())/8766 AS Yas
FROM Athletes
WHERE DATEDIFF(hour, BirthDate, GETDATE())/8766 < 18;


-- 28. Busiest Training Day of the Month

SELECT DATENAME(dw, Date) AS Gun, COUNT(*) AS Sayi
FROM Trainings
GROUP BY DATENAME(dw, Date)
ORDER BY Sayi DESC;


-- 29. Team with Highest Injury Rate

SELECT TOP 1 T.Name, COUNT(I.Id) as SakatlikSayisi
FROM Injuries I
JOIN Athletes A ON I.AthleteId = A.Id
JOIN Teams T ON A.TeamId = T.Id
GROUP BY T.Name
ORDER BY SakatlikSayisi DESC;

-- 30. Reset System (Use Carefully) (deletes operational data, keeps definitions)

SQL
- DELETE FROM MatchStatistics;
- DELETE FROM Matches;
- DELETE FROM TrainingAttendances;
- DELETE FROM Trainings;
- DELETE FROM Injuries;
- DELETE FROM Athletes;
