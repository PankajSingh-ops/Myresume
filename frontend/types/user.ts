export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    isEmailVerified: boolean;
    avatarUrl?: string;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    password: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}
