import { api } from "./axiosConfig";
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  UpdateProfileRequest,
} from "@/types"; // Types are defined in the shared types file

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },
  // NEW: Update profile
  updateProfile: async (id: number, data: UpdateProfileRequest) => {
    const response = await api.put(`/auth/update-profile/${id}`, data);
    return response.data;
  },
  // NEW: Change password
  changePassword: async (id: number, data: ChangePasswordRequest) => {
    const response = await api.post(`/auth/change-password/${id}`, data);
    return response.data;
  },
  // NEW: Upload profile photo
  uploadPhoto: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/auth/upload-photo/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
