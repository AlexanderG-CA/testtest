import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// API Response wrapper
export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    status: number;
}

// API Error structure
export interface ApiError {
    message: string;
    status?: number;
    errors?: Record<string, string[]>;
}

class ApiClient {
    private client: AxiosInstance;
    private tokenRefreshInProgress = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7039',
            withCredentials: true, // Important for cookies
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor - Add JWT token to requests
        this.client.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - Handle 401 and refresh token
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                // Don't intercept errors from login/register endpoints
                const isAuthEndpoint = originalRequest.url?.includes('/api/auth/login') ||
                    originalRequest.url?.includes('/api/auth/register');

                // If 401 and haven't retried yet, try to refresh token (but not for auth endpoints)
                if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
                    if (this.tokenRefreshInProgress) {
                        // Wait for token refresh to complete
                        return new Promise((resolve) => {
                            this.refreshSubscribers.push((token: string) => {
                                if (originalRequest.headers) {
                                    originalRequest.headers.Authorization = `Bearer ${token}`;
                                }
                                resolve(this.client(originalRequest));
                            });
                        });
                    }

                    originalRequest._retry = true;
                    this.tokenRefreshInProgress = true;

                    try {
                        const newToken = await this.refreshToken();
                        this.tokenRefreshInProgress = false;

                        // Notify all waiting requests
                        this.refreshSubscribers.forEach(callback => callback(newToken));
                        this.refreshSubscribers = [];

                        // Retry original request with new token
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        }
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        this.tokenRefreshInProgress = false;
                        this.refreshSubscribers = [];
                        this.clearToken();

                        // Don't redirect - let the AuthContext handle showing the login popup
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // Token management
    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('accessToken');
    }

    private setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
        }
    }

    private clearToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }

    private async refreshToken(): Promise<string> {
        const refreshToken = typeof window !== 'undefined'
            ? localStorage.getItem('refreshToken')
            : null;

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
            { refreshToken },
            { withCredentials: true }
        );

        const newToken = response.data.accessToken;
        this.setToken(newToken);
        return newToken;
    }

    // Generic CRUD methods
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.get<T>(url, config);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.post<T>(url, data, config);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.put<T>(url, data, config);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.patch<T>(url, data, config);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.delete<T>(url, config);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Auth specific methods
    async login(email: string, password: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string; user: any }>> {
        const response = await this.post<{ accessToken: string; refreshToken: string; user: any }>(
            '/api/auth/login',
            { email, password }
        );

        if (response.data) {
            this.setToken(response.data.accessToken);
            if (typeof window !== 'undefined') {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
        }

        return response;
    }

    async logout(): Promise<void> {
        try {
            await this.post('/api/auth/logout');
        } finally {
            this.clearToken();
        }
    }

    async getCurrentUser<T>(): Promise<ApiResponse<T>> {
        return this.get<T>('/api/auth/me');
    }

    // Error handler
    private handleError(error: any): ApiResponse {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ error?: string; errors?: Record<string, string[]> }>;

            return {
                error: axiosError.response?.data?.error || axiosError.message || 'An error occurred',
                status: axiosError.response?.status || 500,
            };
        }

        return {
            error: error.message || 'An unexpected error occurred',
            status: 500,
        };
    }

    // Helper for query params
    buildQueryString(params: Record<string, any>): string {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query.append(key, String(value));
            }
        });
        return query.toString();
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing or custom instances
export default ApiClient;