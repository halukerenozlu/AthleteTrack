import { api } from "./axiosConfig";
import type { DashboardSummary } from "@/types";

export const dashboardApi = {
  // Özet verileri getir
  getSummary: async (coachId: number) => {
    const response = await api.get<DashboardSummary>(
      `/dashboard/summary/${coachId}`
    );
    return response.data;
  },
};
