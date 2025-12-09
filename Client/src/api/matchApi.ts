import { api } from "./axiosConfig";
import type { Match, CreateMatchRequest } from "@/types";

export const matchApi = {
  // Hocanın fikstürünü getir
  getMatches: async (coachId: number) => {
    const response = await api.get<Match[]>(`/matches/coach/${coachId}`);
    return response.data;
  },

  // Yeni Maç Ekle
  createMatch: async (data: CreateMatchRequest) => {
    const response = await api.post("/matches", data);
    return response.data;
  },

  // Maç Sil
  deleteMatch: async (id: number) => {
    const response = await api.delete(`/matches/${id}`);
    return response.data;
  },
};
