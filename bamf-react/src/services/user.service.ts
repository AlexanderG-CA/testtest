// services/user.service.ts
import { apiClient, ApiResponse } from '@/lib/api-client';
import { User } from '@/types/api.types';

export const userService = {
    // Get current user
    async getCurrentUser(): Promise<ApiResponse<User>> {
        try {
            return await apiClient.get<User>('/api/users/me');
        } catch (error: any) {
            return { error: error.message || 'Failed to get current user', status: 500 };
        }
    },

    // Get user by ID
    async getUserById(id: number): Promise<ApiResponse<User>> {
        try {
            return await apiClient.get<User>(`/api/users/${id}`);
        } catch (error: any) {
            return { error: error.message || 'Failed to get user', status: 500 };
        }
    },

    // Update user cart
    async updateCart(cart: object): Promise<ApiResponse<{ cart: any }>> {
        try {
            const response = await apiClient.put<User>('/api/users/cart', { cart: JSON.stringify(cart) });
            if (response.data) {
                try {
                    const parsed = JSON.parse(response.data.cart || '{}');
                    return { data: { cart: parsed }, status: response.status };
                } catch (parseError) {
                    console.error('Failed to parse cart JSON after update:', parseError);
                    return { data: { cart: {} }, status: response.status };
                }
            }
            return { error: response.error || 'Failed to update cart', status: response.status };
        } catch (error: any) {
            return { error: error.message || 'Failed to update cart', status: 500 };
        }
    },

    // Get user cart
    async getCart(): Promise<ApiResponse<{ cart: any }>> {
        try {
            const response = await apiClient.get<User>('/api/users/me');
            if (response.data) {
                try {
                    const cart = JSON.parse(response.data.cart || '{}');
                    return { data: { cart }, status: response.status };
                } catch (parseError) {
                    console.error('Failed to parse cart JSON:', parseError);
                    return { data: { cart: {} }, status: response.status };
                }
            }
            return { error: response.error || 'Failed to get cart', status: response.status };
        } catch (error: any) {
            return { error: error.message || 'Failed to get cart', status: 500 };
        }
    },

    // Clear user cart
    async clearCart(): Promise<ApiResponse<User>> {
        try {
            return await apiClient.put<User>('/api/users/cart', { cart: '{}' });
        } catch (error: any) {
            return { error: error.message || 'Failed to clear cart', status: 500 };
        }
    },

    // Add item to cart
    async addToCart(item: any): Promise<ApiResponse<{ cart: any }>> {
        try {
            const cartResponse = await this.getCart();
            if (cartResponse.data?.cart) {
                const updatedCart = { ...cartResponse.data.cart, ...item };
                return await this.updateCart(updatedCart);
            }
            return { error: 'Failed to add to cart', status: 500 };
        } catch (error: any) {
            return { error: error.message || 'Failed to add to cart', status: 500 };
        }
    },

    // Remove item from cart
    async removeFromCart(itemId: string | number): Promise<ApiResponse<{ cart: any }>> {
        try {
            const cartResponse = await this.getCart();
            if (cartResponse.data?.cart) {
                const updatedCart = { ...cartResponse.data.cart };
                delete updatedCart[itemId];
                return await this.updateCart(updatedCart);
            }
            return { error: 'Failed to remove from cart', status: 500 };
        } catch (error: any) {
            return { error: error.message || 'Failed to remove from cart', status: 500 };
        }
    },
};