import { api } from "./axiosConfig";
import type { Match, CreateMatchRequest } from "@/types";

export const matchApi = {
  // Translated comment.
  getMatches: async (coachId: number) => {
    const response = await api.get<Match[]>(`/matches/coach/${coachId}`);
    return response.data;
  },

  // Translated comment.
  createMatch: async (data: CreateMatchRequest) => {
    const response = await api.post("/matches", data);
    return response.data;
  },

  // Translated comment.
  deleteMatch: async (id: number) => {
    const response = await api.delete(`/matches/${id}`);
    return response.data;
  },
};
