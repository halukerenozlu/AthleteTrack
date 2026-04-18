import { api } from "./axiosConfig";
import type { Team, CreateTeamRequest } from "@/types";

export const teamApi = {
  // Translated comment.
  getMyTeams: async (coachId: number) => {
    const response = await api.get<Team[]>(`/teams/coach/${coachId}`);
    return response.data;
  },

  // Translated comment.
  createTeam: async (data: CreateTeamRequest) => {
    const response = await api.post("/teams", data);
    return response.data;
  },

  // Translated comment.
  deleteTeam: async (id: number) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },
  // Translated comment.
  updateTeam: async (id: number, data: CreateTeamRequest) => {
    const response = await api.put(`/teams/${id}`, data);
    return response.data;
  },
};
