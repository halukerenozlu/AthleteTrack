import { api } from "./axiosConfig";
import type { Match, CreateMatchRequest } from "@/types";

export const matchApi = {
  // Get coach fixtures
  getMatches: async (coachId: number) => {
    const response = await api.get<Match[]>(`/matches/coach/${coachId}`);
    return response.data;
  },

  // Add New Match
  createMatch: async (data: CreateMatchRequest) => {
    const response = await api.post("/matches", data);
    return response.data;
  },

  // Delete match
  deleteMatch: async (id: number) => {
    const response = await api.delete(`/matches/${id}`);
    return response.data;
  },
};
