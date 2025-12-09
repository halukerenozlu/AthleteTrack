import { api } from "./axiosConfig";
import type {
  Training,
  CreateTrainingRequest,
  TrainingType,
  AttendanceItem,
  SaveAttendanceRequest,
} from "@/types";

export const trainingApi = {
  // Hocanın tüm antrenmanlarını getir
  getTrainings: async (coachId: number) => {
    const response = await api.get<Training[]>(`/trainings/coach/${coachId}`);
    return response.data;
  },

  // Antrenman Ekle
  createTraining: async (data: CreateTrainingRequest) => {
    const response = await api.post("/trainings", data);
    return response.data;
  },

  // Antrenman Sil
  deleteTraining: async (id: number) => {
    const response = await api.delete(`/trainings/${id}`);
    return response.data;
  },

  // Antrenman Tiplerini Getir (Kondisyon, Taktik vb.)
  getTypes: async () => {
    const response = await api.get<TrainingType[]>("/trainings/types");
    return response.data;
  },

  // 1. Yoklama Listesini Getir
  getAttendance: async (trainingId: number) => {
    const response = await api.get<AttendanceItem[]>(
      `/trainings/attendance/${trainingId}`
    );
    return response.data;
  },

  // 2. Yoklamayı Kaydet
  saveAttendance: async (data: SaveAttendanceRequest) => {
    const response = await api.post("/trainings/attendance", data);
    return response.data;
  },
};
