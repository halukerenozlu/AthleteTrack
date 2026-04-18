import { api } from "./axiosConfig";
import type { Injury, CreateInjuryRequest, InjuryType } from "@/types";

export const injuryApi = {
  // Get all injuries of the coach
  getInjuries: async (coachId: number) => {
    const response = await api.get<Injury[]>(`/injuries/coach/${coachId}`);
    return response.data;
  },

  // Add new injury
  createInjury: async (data: CreateInjuryRequest) => {
    const response = await api.post("/injuries", data);
    return response.data;
  },

  // Toggle status (Recovered / Injured)
  toggleStatus: async (id: number) => {
    const response = await api.put(`/injuries/status/${id}`);
    return response.data;
  },

  // Delete
  deleteInjury: async (id: number) => {
    const response = await api.delete(`/injuries/${id}`);
    return response.data;
  },

  // Get Injury Types (for dropdown)
  getTypes: async () => {
    const response = await api.get<InjuryType[]>("/injuries/types");
    return response.data;
  },
};
