import { api } from "./axiosConfig";
import type { Team, CreateTeamRequest } from "@/types";

export const teamApi = {
  // Hocanın takımlarını getir
  getMyTeams: async (coachId: number) => {
    const response = await api.get<Team[]>(`/teams/coach/${coachId}`);
    return response.data;
  },

  // Yeni takım ekle
  createTeam: async (data: CreateTeamRequest) => {
    const response = await api.post("/teams", data);
    return response.data;
  },

  // Takım sil
  deleteTeam: async (id: number) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },
  // YENİ: Takım Güncelle
  updateTeam: async (id: number, data: CreateTeamRequest) => {
    const response = await api.put(`/teams/${id}`, data);
    return response.data;
  },
};
