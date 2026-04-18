import { api } from "./axiosConfig";
import type { Athlete, CreateAthleteRequest } from "@/types";

export const athleteApi = {
  // Fetch all athletes
  getAllAthletes: async (coachId: number) => {
    const response = await api.get<Athlete[]>(`/athletes/coach/${coachId}`);
    return response.data;
  },

  // Fetch by team
  getAthletesByTeam: async (teamId: number) => {
    const response = await api.get<Athlete[]>(`/athletes/team/${teamId}`);
    return response.data;
  },

  // Add athlete (returns ID)
  addAthlete: async (data: CreateAthleteRequest) => {
    const response = await api.post("/athletes", data);
    return response.data; // Returns { message: "...", id: 123 }
  },

  // Athlete Delete
  deleteAthlete: async (id: number) => {
    const response = await api.delete(`/athletes/${id}`);
    return response.data;
  },

  // --- NEWLY ADDED: PHOTO UPLOAD ---
  uploadPhoto: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/athletes/upload-photo/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  // NEW: Athlete Update
  updateAthlete: async (id: number, data: CreateAthleteRequest) => {
    const response = await api.put(`/athletes/${id}`, data);
    return response.data;
  },
};
