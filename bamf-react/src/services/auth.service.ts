import { apiClient, ApiResponse } from '@/lib/api-client';
import { LoginDto, RegisterDto, User } from '@/types/api.types';

export const authService = {
    // Login
    async login(data: LoginDto): Promise<ApiResponse<{ user: User; accessToken: string }>> {
        return apiClient.login(data.email, data.password);
    },

    // Register
    async register(data: RegisterDto): Promise<ApiResponse<{ message: string }>> {
        return apiClient.post<{ message: string }>('/api/auth/register', data);
    },

    // Logout
    async logout(): Promise<void> {
        return apiClient.logout();
    },

    // Check if authenticated
    async checkAuth(): Promise<ApiResponse<User>> {
        return apiClient.getCurrentUser<User>();
    },
};