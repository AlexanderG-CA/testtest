import { apiClient, ApiResponse } from '@/lib/api-client';
import { User } from '@/types/api.types';

export const userService = {
    // Get current user
    async getCurrentUser(): Promise<ApiResponse<User>> {
        return apiClient.getCurrentUser<User>();
    },

    // Update user cart
    async updateCart(cart: object): Promise<ApiResponse<User>> {
        return apiClient.put<User>('/api/users/cart', { cart: JSON.stringify(cart) });
    },

    // Get user cart
    async getCart(): Promise<ApiResponse<{ cart: any }>> {
        const response = await apiClient.get<User>('/api/users/me');
        if (response.data) {
            try {
                const cart = JSON.parse(response.data.cart || '{}');
                return { data: { cart }, status: response.status };
            } catch {
                return { data: { cart: {} }, status: response.status };
            }
        }
        return { error: response.error, status: response.status };
    },
};