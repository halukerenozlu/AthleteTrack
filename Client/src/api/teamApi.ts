import { api } from "./axiosConfig";
import type { Team, CreateTeamRequest } from "@/types";

export const teamApi = {
  // Fetch coach teams
  getMyTeams: async (coachId: number) => {
    const response = await api.get<Team[]>(`/teams/coach/${coachId}`);
    return response.data;
  },

  // Add new team
  createTeam: async (data: CreateTeamRequest) => {
    const response = await api.post("/teams", data);
    return response.data;
  },

  // Delete team
  deleteTeam: async (id: number) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },
  // NEW: Team Update
  updateTeam: async (id: number, data: CreateTeamRequest) => {
    const response = await api.put(`/teams/${id}`, data);
    return response.data;
  },
};
