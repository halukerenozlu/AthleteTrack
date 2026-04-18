import { api } from "./axiosConfig";
import type { MatchStatItem, SaveMatchStatsRequest } from "@/types";

export const matchStatsApi = {
  // Maçın istatistiklerini getir
  getStats: async (matchId: number) => {
    const response = await api.get<MatchStatItem[]>(
      `/matchstats/match/${matchId}`
    );
    return response.data;
  },

  // İstatistikleri kaydet
  saveStats: async (data: SaveMatchStatsRequest) => {
    const response = await api.post("/matchstats", data);
    return response.data;
  },
};
