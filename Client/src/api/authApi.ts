import { api } from "./axiosConfig";
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  UpdateProfileRequest,
} from "@/types"; // Birazdan types oluşturacağız

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },
  // YENİ: Profil Güncelleme
  updateProfile: async (id: number, data: UpdateProfileRequest) => {
    const response = await api.put(`/auth/update-profile/${id}`, data);
    return response.data;
  },
  // YENİ: Şifre Değiştirme
  changePassword: async (id: number, data: ChangePasswordRequest) => {
    const response = await api.post(`/auth/change-password/${id}`, data);
    return response.data;
  },
  // YENİ: Profil Fotoğrafı Yükleme
  uploadPhoto: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/auth/upload-photo/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
