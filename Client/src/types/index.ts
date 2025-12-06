// Giriş yaparken gönderdiğimiz veri
export interface LoginRequest {
  email: string;
  password: string;
}

// Backend'den dönen veri (AuthController.cs ile aynı olmalı)
export interface LoginResponse {
  id: number;
  username: string;
  fullName: string;
  role: string;
  isTemporaryPassword: boolean;
  message: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
