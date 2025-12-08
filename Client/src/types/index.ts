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
