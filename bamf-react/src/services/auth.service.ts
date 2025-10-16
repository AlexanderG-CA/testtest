import { apiClient, ApiResponse, UserFromToken } from '@/lib/api-client';

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
}

export interface BackendAuthResponse {
    email: string;
    token: string;
}

export const authService = {
    // FIXED: Accept email and password directly
    async login(data: LoginDto): Promise<ApiResponse<BackendAuthResponse>> {
        return apiClient.login(data.email, data.password);
    },

    // FIXED: Backend returns AuthResponseDto (email & token), not { message: string }
    async register(data: RegisterDto): Promise<ApiResponse<BackendAuthResponse>> {
        return apiClient.post<BackendAuthResponse>('/api/auth/register', data);
    },

    // Logout
    async logout(): Promise<void> {
        return apiClient.logout();
    },

    // FIXED: Get user from JWT token and return UserFromToken with role
    async checkAuth(): Promise<ApiResponse<UserFromToken>> {
        return apiClient.getCurrentUser();
    },
};