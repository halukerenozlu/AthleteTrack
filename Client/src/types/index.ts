// Payload sent during login
export interface LoginRequest {
  email: string;
  password: string;
}

// Response returned from backend (must match AuthController.cs)
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

// --- TEAM TYPES ---

// Team List for (Backend: TeamResponseDto)
export interface Team {
  id: number;
  name: string;
  category: string;
  playerCount: number;
}

// Data sent when adding a new team (Backend: CreateTeamDto)
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
  jerseyNumber?: number; // Optional
  height: number;
  weight: number;
  phone?: string;
  teamId: number; // Target team
  positionId: number; // Target position
  birthDate: string; // Date
}

// Position type
export interface Position {
  id: number;
  name: string;
  shortName: string;
}

// --- TRAINING TYPES ---

export interface TrainingType {
  id: number;
  name: string;
  colorCode: string;
}

export interface Training {
  id: number;
  date: string; // ISO string
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

// Attendance types
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

// --- HEALTH CENTER TYPES ---

export interface InjuryType {
  id: number;
  name: string;
  description?: string;
}

export interface Injury {
  id: number;
  athleteName: string;
  teamName: string;
  athleteImage: string; // Backend returns byte[]; JSON uses base64 string
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

// --- DASHBOARD TYPES ---

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
  type: string; // 'Training', 'Injury', etc.
}

export interface DashboardSummary {
  totalAthletes: number;
  activeInjuries: number;
  attendanceRate: number;
  nextMatchDate: string;
  teamStats: TeamStat[];
  injuryStats: InjuryStat[]; // May be empty if backend does not provide it
  recentActivities: RecentActivity[];
  topScorers: TopPerformer[];
  topRatedPlayers: TopPerformer[];
}

// (MATCHES / FIXTURE)
export interface Match {
  id: number;
  matchDate: string; // ISO string
  opponent: string;
  isHome: boolean;
  teamName: string;
  teamScore?: number;
  opponentScore?: number;
  status: string; // "Planned" or "Completed"
}

export interface CreateMatchRequest {
  matchDate: string;
  opponent: string;
  isHome: boolean;
  teamId: number;
}

//(STATS)

export interface MatchStatItem {
  id: number;
  athleteId: number;
  athleteName: string;
  jerseyNumber?: number;
  position: string;
  athleteImage: string; // Base64
  minutesPlayed: number;
  goals: number;
  assists: number;
  rating: number;
  distanceCovered: number;
}

export interface SaveMatchStatsRequest {
  matchId: number;
  stats: {
    athleteId: number;
    minutesPlayed: number;
    goals: number;
    assists: number;
    rating: number;
    distanceCovered: number;
  }[];
}
// UPDATED SECTION: Leaderboard tables added
export interface TopPerformer {
  athleteId: number;
  name: string;
  teamName: string;
  image: string;
  value: number;
  label: string;
}
