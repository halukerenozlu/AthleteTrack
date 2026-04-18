import { api } from "./axiosConfig";
import type { DashboardSummary } from "@/types";

export const dashboardApi = {
  // Translated comment.
  getSummary: async (coachId: number) => {
    const response = await api.get<DashboardSummary>(
      `/dashboard/summary/${coachId}`
    );
    return response.data;
  },
};
