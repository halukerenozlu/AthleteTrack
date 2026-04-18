import { api } from "./axiosConfig";
import type {
  Training,
  CreateTrainingRequest,
  TrainingType,
  AttendanceItem,
  SaveAttendanceRequest,
} from "@/types";

export const trainingApi = {
  // Translated comment.
  getTrainings: async (coachId: number) => {
    const response = await api.get<Training[]>(`/trainings/coach/${coachId}`);
    return response.data;
  },

  // Translated comment.
  createTraining: async (data: CreateTrainingRequest) => {
    const response = await api.post("/trainings", data);
    return response.data;
  },

  // Translated comment.
  deleteTraining: async (id: number) => {
    const response = await api.delete(`/trainings/${id}`);
    return response.data;
  },

  // Translated comment.
  getTypes: async () => {
    const response = await api.get<TrainingType[]>("/trainings/types");
    return response.data;
  },

  // Translated comment.
  getAttendance: async (trainingId: number) => {
    const response = await api.get<AttendanceItem[]>(
      `/trainings/attendance/${trainingId}`
    );
    return response.data;
  },

  // Translated comment.
  saveAttendance: async (data: SaveAttendanceRequest) => {
    const response = await api.post("/trainings/attendance", data);
    return response.data;
  },
};
