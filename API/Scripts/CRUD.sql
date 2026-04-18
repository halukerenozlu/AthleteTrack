-- =============================================
-- ATHLETE MANAGEMENT (ATHLETES)
-- =============================================

-- 1. Add New Athlete (CREATE)
INSERT INTO Athletes (FirstName, LastName, JerseyNumber, BirthDate, Height, Weight, Phone, TeamId, PositionId, CreatedAt)
VALUES ('Arda', 'Güler', 10, '2005-02-25', 176, 70, '05551112233', 2, 8, GETDATE());

-- 2. List All Athletes (READ)
SELECT A.FirstName, A.LastName, T.Name AS Takim, P.Name AS Mevki
FROM Athletes A
JOIN Teams T ON A.TeamId = T.Id
JOIN Positions P ON A.PositionId = P.Id;

-- 3. Update Athlete Information (UPDATE)
-- Example: Weight changed and phone updated
UPDATE Athletes
SET Weight = 72, Phone = '05559998877'
WHERE Id = 1;

-- 4. Delete Athlete (DELETE)
DELETE FROM Athletes WHERE Id = 5;

-- 5. Find Athletes in a Specific Team (FILTERING)
SELECT * FROM Athletes WHERE TeamId = (SELECT Id FROM Teams WHERE Name = 'U19 Akademi');


-- =============================================
-- TEAM MANAGEMENT (TEAMS)
-- =============================================

-- 6. Create New Team (CREATE)
INSERT INTO Teams (Name, Category, CoachId, CreatedAt)
VALUES ('U14 Gelişim', 'Altyapı', 1, GETDATE());

-- 7. Rename Team (UPDATE)
UPDATE Teams
SET Name = 'U15 Elit Akademi'
WHERE Name = 'U14 Gelişim';

-- 8. Get Teams by Coach (READ)
SELECT * FROM Teams WHERE CoachId = 1;


-- =============================================
-- TRAINING AND ATTENDANCE (TRAININGS & ATTENDANCE)
-- =============================================

-- 9. Schedule New Training (CREATE)
INSERT INTO Trainings (Date, DurationMinutes, Notes, TeamId, TrainingTypeId, CreatedAt)
VALUES ('2025-12-15 17:00:00', 90, 'Maç taktiği çalışılacak', 2, 2, GETDATE());

-- 10. Record Attendance for a Training (CREATE - Bulk Insert)
-- Add attendance records for athletes 1 and 2 to training ID 10
INSERT INTO TrainingAttendances (TrainingId, AthleteId, IsPresent, PerformanceRating)
VALUES 
(10, 1, 1, 8),
(10, 2, 1, 9);

-- 11. Update Training Note (UPDATE)
UPDATE Trainings 
SET Notes = 'Yağmur nedeniyle salon antrenmanı yapıldı' 
WHERE Id = 10;

-- 12. Update Athlete Training Rating (UPDATE)
UPDATE TrainingAttendances
SET PerformanceRating = 10
WHERE TrainingId = 10 AND AthleteId = 1;


-- =============================================
-- HEALTH AND INJURIES (INJURIES)
-- =============================================

-- 13. Create New Injury Record (CREATE)
INSERT INTO Injuries (InjuryDate, IsActive, Notes, AthleteId, InjuryTypeId)
VALUES (GETDATE(), 1, 'Antrenmanda darbe aldı', 1, 4);

-- 14. Mark Injury as "Recovered" (UPDATE)
-- Set IsActive = 0 to mark as inactive
UPDATE Injuries
SET IsActive = 0, ExpectedReturnDate = GETDATE()
WHERE Id = 3;

-- 15. Delete Incorrect Injury Record (DELETE)
DELETE FROM Injuries WHERE Id = 3;
