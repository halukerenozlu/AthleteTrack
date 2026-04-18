import { api } from "./axiosConfig";
import type { MatchStatItem, SaveMatchStatsRequest } from "@/types";

export const matchStatsApi = {
  // Translated comment.
  getStats: async (matchId: number) => {
    const response = await api.get<MatchStatItem[]>(
      `/matchstats/match/${matchId}`
    );
    return response.data;
  },

  // Translated comment.
  saveStats: async (data: SaveMatchStatsRequest) => {
    const response = await api.post("/matchstats", data);
    return response.data;
  },
};
