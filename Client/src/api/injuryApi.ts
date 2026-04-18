import { api } from "./axiosConfig";
import type { Injury, CreateInjuryRequest, InjuryType } from "@/types";

export const injuryApi = {
  // Translated comment.
  getInjuries: async (coachId: number) => {
    const response = await api.get<Injury[]>(`/injuries/coach/${coachId}`);
    return response.data;
  },

  // Translated comment.
  createInjury: async (data: CreateInjuryRequest) => {
    const response = await api.post("/injuries", data);
    return response.data;
  },

  // Translated comment.
  toggleStatus: async (id: number) => {
    const response = await api.put(`/injuries/status/${id}`);
    return response.data;
  },

  // Translated comment.
  deleteInjury: async (id: number) => {
    const response = await api.delete(`/injuries/${id}`);
    return response.data;
  },

  // Translated comment.
  getTypes: async () => {
    const response = await api.get<InjuryType[]>("/injuries/types");
    return response.data;
  },
};
