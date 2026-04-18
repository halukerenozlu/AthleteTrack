import { api } from "./axiosConfig";
import type {
  Training,
  CreateTrainingRequest,
  TrainingType,
  AttendanceItem,
  SaveAttendanceRequest,
} from "@/types";

export const trainingApi = {
  // Get all trainings of the coach
  getTrainings: async (coachId: number) => {
    const response = await api.get<Training[]>(`/trainings/coach/${coachId}`);
    return response.data;
  },

  // Add training
  createTraining: async (data: CreateTrainingRequest) => {
    const response = await api.post("/trainings", data);
    return response.data;
  },

  // Delete training
  deleteTraining: async (id: number) => {
    const response = await api.delete(`/trainings/${id}`);
    return response.data;
  },

  // Fetch training types (Conditioning, Tactics, etc.)
  getTypes: async () => {
    const response = await api.get<TrainingType[]>("/trainings/types");
    return response.data;
  },

  // 1. Get Attendance List
  getAttendance: async (trainingId: number) => {
    const response = await api.get<AttendanceItem[]>(
      `/trainings/attendance/${trainingId}`
    );
    return response.data;
  },

  // 2. Save Attendance
  saveAttendance: async (data: SaveAttendanceRequest) => {
    const response = await api.post("/trainings/attendance", data);
    return response.data;
  },
};
