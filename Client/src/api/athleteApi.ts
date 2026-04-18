import { api } from "./axiosConfig";
import type { Athlete, CreateAthleteRequest } from "@/types";

export const athleteApi = {
  // Translated comment.
  getAllAthletes: async (coachId: number) => {
    const response = await api.get<Athlete[]>(`/athletes/coach/${coachId}`);
    return response.data;
  },

  // Translated comment.
  getAthletesByTeam: async (teamId: number) => {
    const response = await api.get<Athlete[]>(`/athletes/team/${teamId}`);
    return response.data;
  },

  // Translated comment.
  addAthlete: async (data: CreateAthleteRequest) => {
    const response = await api.post("/athletes", data);
    return response.data; // Translated comment.
  },

  // Translated comment.
  deleteAthlete: async (id: number) => {
    const response = await api.delete(`/athletes/${id}`);
    return response.data;
  },

  // Translated comment.
  uploadPhoto: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/athletes/upload-photo/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  // Translated comment.
  updateAthlete: async (id: number, data: CreateAthleteRequest) => {
    const response = await api.put(`/athletes/${id}`, data);
    return response.data;
  },
};
