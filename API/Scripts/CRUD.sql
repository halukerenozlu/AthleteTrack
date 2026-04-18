-- Translated comment.
-- Translated comment.
-- Translated comment.

-- Translated comment.
INSERT INTO Athletes (FirstName, LastName, JerseyNumber, BirthDate, Height, Weight, Phone, TeamId, PositionId, CreatedAt)
VALUES ('Arda', 'Güler', 10, '2005-02-25', 176, 70, '05551112233', 2, 8, GETDATE());

-- Translated comment.
SELECT A.FirstName, A.LastName, T.Name AS Takim, P.Name AS Mevki
FROM Athletes A
JOIN Teams T ON A.TeamId = T.Id
JOIN Positions P ON A.PositionId = P.Id;

-- Translated comment.
-- Translated comment.
UPDATE Athletes
SET Weight = 72, Phone = '05559998877'
WHERE Id = 1;

-- Translated comment.
DELETE FROM Athletes WHERE Id = 5;

-- Translated comment.
SELECT * FROM Athletes WHERE TeamId = (SELECT Id FROM Teams WHERE Name = 'U19 Akademi');


-- Translated comment.
-- Translated comment.
-- Translated comment.

-- Translated comment.
INSERT INTO Teams (Name, Category, CoachId, CreatedAt)
VALUES ('U14 Gelişim', 'Altyapı', 1, GETDATE());

-- Translated comment.
UPDATE Teams
SET Name = 'U15 Elit Akademi'
WHERE Name = 'U14 Gelişim';

-- Translated comment.
SELECT * FROM Teams WHERE CoachId = 1;


-- Translated comment.
-- Translated comment.
-- Translated comment.

-- Translated comment.
INSERT INTO Trainings (Date, DurationMinutes, Notes, TeamId, TrainingTypeId, CreatedAt)
VALUES ('2025-12-15 17:00:00', 90, 'Maç taktiği çalışılacak', 2, 2, GETDATE());

-- Translated comment.
-- Translated comment.
INSERT INTO TrainingAttendances (TrainingId, AthleteId, IsPresent, PerformanceRating)
VALUES 
(10, 1, 1, 8),
(10, 2, 1, 9);

-- Translated comment.
UPDATE Trainings 
SET Notes = 'Yağmur nedeniyle salon antrenmanı yapıldı' 
WHERE Id = 10;

-- Translated comment.
UPDATE TrainingAttendances
SET PerformanceRating = 10
WHERE TrainingId = 10 AND AthleteId = 1;


-- Translated comment.
-- Translated comment.
-- Translated comment.

-- Translated comment.
INSERT INTO Injuries (InjuryDate, IsActive, Notes, AthleteId, InjuryTypeId)
VALUES (GETDATE(), 1, 'Antrenmanda darbe aldı', 1, 4);

-- Translated comment.
-- Translated comment.
UPDATE Injuries
SET IsActive = 0, ExpectedReturnDate = GETDATE()
WHERE Id = 3;

-- Translated comment.
DELETE FROM Injuries WHERE Id = 3;
