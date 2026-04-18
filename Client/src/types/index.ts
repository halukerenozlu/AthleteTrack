// Translated comment.
export interface LoginRequest {
  email: string;
  password: string;
}

// Translated comment.
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

// Translated comment.

// Translated comment.
export interface Team {
  id: number;
  name: string;
  category: string;
  playerCount: number;
}

// Translated comment.
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
  jerseyNumber?: number; // Translated comment.
  height: number;
  weight: number;
  phone?: string;
  teamId: number; // Translated comment.
  positionId: number; // Translated comment.
  birthDate: string; // Translated comment.
}

// Translated comment.
export interface Position {
  id: number;
  name: string;
  shortName: string;
}

// Translated comment.

export interface TrainingType {
  id: number;
  name: string;
  colorCode: string;
}

export interface Training {
  id: number;
  date: string; // Translated comment.
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

// Translated comment.
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

// Translated comment.

export interface InjuryType {
  id: number;
  name: string;
  description?: string;
}

export interface Injury {
  id: number;
  athleteName: string;
  teamName: string;
  athleteImage: string; // Translated comment.
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

// Translated comment.

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
  type: string; // Translated comment.
}

export interface DashboardSummary {
  totalAthletes: number;
  activeInjuries: number;
  attendanceRate: number;
  nextMatchDate: string;
  teamStats: TeamStat[];
  injuryStats: InjuryStat[]; // Translated comment.
  recentActivities: RecentActivity[];
  topScorers: TopPerformer[];
  topRatedPlayers: TopPerformer[];
}

// Translated comment.
export interface Match {
  id: number;
  matchDate: string; // Translated comment.
  opponent: string;
  isHome: boolean;
  teamName: string;
  teamScore?: number;
  opponentScore?: number;
  status: string; // Translated comment.
}

export interface CreateMatchRequest {
  matchDate: string;
  opponent: string;
  isHome: boolean;
  teamId: number;
}

// Translated comment.

export interface MatchStatItem {
  id: number;
  athleteId: number;
  athleteName: string;
  jerseyNumber?: number;
  position: string;
  athleteImage: string; // Translated comment.
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
// Translated comment.
export interface TopPerformer {
  athleteId: number;
  name: string;
  teamName: string;
  image: string;
  value: number;
  label: string;
}
