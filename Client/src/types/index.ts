// Giriş yaparken gönderdiğimiz veri
export interface LoginRequest {
  email: string;
  password: string;
}

// Backend'den dönen veri (AuthController.cs ile aynı olmalı)
export interface LoginResponse {
  id: number;
  username: string;
  fullName: string;
  role: string;
  isTemporaryPassword: boolean;
  message: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// --- TAKIM TİPLERİ ---

// Takım Listesi için (Backend: TeamResponseDto)
export interface Team {
  id: number;
  name: string;
  category: string;
  playerCount: number;
}

// Yeni Takım Eklerken gidecek veri (Backend: CreateTeamDto)
export interface CreateTeamRequest {
  name: string;
  category: string;
  coachId: number;
}
export interface Athlete {
  id: number;
  fullName: string;
  jerseyNumber: number;
  position: string;
  teamName: string;
  age: number;
  hasImage: boolean;
  height: number;
  weight: number;
  phone?: string;
  birthDate: string;
}

export interface CreateAthleteRequest {
  firstName: string;
  lastName: string;
  jerseyNumber?: number; // Opsiyonel
  height: number;
  weight: number;
  phone?: string;
  teamId: number; // Hangi takım?
  positionId: number; // Hangi mevki?
  birthDate: string; // Tarih
}

// Mevki Tipi
export interface Position {
  id: number;
  name: string;
  shortName: string;
}

// --- ANTRENMAN TİPLERİ ---

export interface TrainingType {
  id: number;
  name: string;
  colorCode: string;
}

export interface Training {
  id: number;
  date: string; // ISO string gelir
  durationMinutes: number;
  notes?: string;
  teamName: string;
  typeName: string;
  colorCode: string;
  participantCount: number;
}

export interface CreateTrainingRequest {
  date: string;
  durationMinutes: number;
  notes?: string;
  teamId: number;
  trainingTypeId: number;
}

// Yoklama Tipleri
export interface AttendanceItem {
  athleteId: number;
  athleteName: string;
  isPresent: boolean;
  performanceRating?: number;
}

export interface SaveAttendanceRequest {
  trainingId: number;
  attendances: {
    athleteId: number;
    isPresent: boolean;
    performanceRating?: number;
  }[];
}

// --- SAĞLIK MERKEZİ TİPLERİ ---

export interface InjuryType {
  id: number;
  name: string;
  description?: string;
}

export interface Injury {
  id: number;
  athleteName: string;
  teamName: string;
  athleteImage: string; // Backend byte[] gönderiyor, JSON'da base64 string olur
  injuryTypeName: string;
  injuryDate: string;
  expectedReturnDate?: string;
  isActive: boolean;
  notes?: string;
}

export interface CreateInjuryRequest {
  athleteId: number;
  injuryTypeId: number;
  injuryDate: string;
  expectedReturnDate?: string;
  notes?: string;
}

// --- DASHBOARD TİPLERİ ---

export interface TeamStat {
  teamName: string;
  athleteCount: number;
}

export interface InjuryStat {
  typeName: string;
  count: number;
}

export interface RecentActivity {
  id: number;
  title: string;
  date: string;
  type: string; // 'Training', 'Injury' vb.
}

export interface DashboardSummary {
  totalAthletes: number;
  activeInjuries: number;
  attendanceRate: number;
  nextMatchDate: string;
  teamStats: TeamStat[];
  injuryStats: InjuryStat[]; // Backend'e eklemediysek boş gelebilir, sorun değil
  recentActivities: RecentActivity[];
}
