import { api } from "./axiosConfig";
import type { Injury, CreateInjuryRequest, InjuryType } from "@/types";

export const injuryApi = {
  // Hocanın tüm sakatlıklarını getir
  getInjuries: async (coachId: number) => {
    const response = await api.get<Injury[]>(`/injuries/coach/${coachId}`);
    return response.data;
  },

  // Yeni Sakatlık Ekle
  createInjury: async (data: CreateInjuryRequest) => {
    const response = await api.post("/injuries", data);
    return response.data;
  },

  // Durum Değiştir (İyileşti / Sakat)
  toggleStatus: async (id: number) => {
    const response = await api.put(`/injuries/status/${id}`);
    return response.data;
  },

  // Sil
  deleteInjury: async (id: number) => {
    const response = await api.delete(`/injuries/${id}`);
    return response.data;
  },

  // Sakatlık Tiplerini Getir (Dropdown için)
  getTypes: async () => {
    const response = await api.get<InjuryType[]>("/injuries/types");
    return response.data;
  },
};
