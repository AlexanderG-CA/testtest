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

// Backend auth response from C# (AuthResponseDto)
interface BackendAuthResponse {
    email: string;
    token: string;
}

// User with role extracted from JWT
export interface UserFromToken {
    id?: number;
    email?: string;
    role?: string; // "User" or "Admin"
}

class ApiClient {
    private client: AxiosInstance;
    private tokenRefreshInProgress = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7039',
            withCredentials: true,
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
                    originalRequest.url?.includes('/api/auth/register') ||
                    originalRequest.url?.includes('/api/auth/admin/login');

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

        const newToken = response.data.token || response.data.accessToken;
        this.setToken(newToken);
        return newToken;
    }

    // Decode JWT to extract user info
    private decodeJwt(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Failed to decode JWT:', error);
            return null;
        }
    }

    // Normalize backend auth response to match frontend expectations
    private normalizeAuthResponse(backendResponse: BackendAuthResponse): BackendAuthResponse {
        return {
            email: backendResponse.email,
            token: backendResponse.token,
        };
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
    async login(email: string, password: string): Promise<ApiResponse<BackendAuthResponse>> {
        try {
            const response = await this.client.post<BackendAuthResponse>(
                '/api/auth/login',
                { email, password }
            );

            const normalizedData = this.normalizeAuthResponse(response.data);

            // Store tokens
            this.setToken(normalizedData.token);
            if (typeof window !== 'undefined') {
                localStorage.setItem('refreshToken', normalizedData.token);
            }

            return {
                data: normalizedData,
                status: response.status
            };
        } catch (error) {
            console.error('❌ API Client: Login failed:', error);
            return this.handleError(error);
        }
    }

    // Admin login method - separate from regular user login
    async adminLogin(userName: string, password: string): Promise<ApiResponse<BackendAuthResponse>> {
        try {
            const response = await this.client.post<BackendAuthResponse>(
                '/api/auth/admin/login',
                { userName, password }
            );

            const normalizedData = this.normalizeAuthResponse(response.data);

            // Store tokens
            this.setToken(normalizedData.token);
            if (typeof window !== 'undefined') {
                localStorage.setItem('refreshToken', normalizedData.token);
            }

            return {
                data: normalizedData,
                status: response.status
            };
        } catch (error) {
            console.error('❌ API Client: Admin login failed:', error);
            return this.handleError(error);
        }
    }

    async logout(): Promise<void> {
        try {
            // Call logout endpoint if it exists on backend
            /* await this.post('/api/auth/logout'); */
        } catch (error) {
            console.warn('Logout endpoint may not exist, clearing token locally:', error);
        } finally {
            this.clearToken();
        }
    }

    // FIXED: Extract user info AND role from JWT
    async getCurrentUser(): Promise<ApiResponse<UserFromToken>> {
        const token = this.getToken();
        if (!token) {
            return { error: 'No token found', status: 401 };
        }

        const decoded = this.decodeJwt(token);
        if (!decoded) {
            return { error: 'Invalid token', status: 401 };
        }

        // Extract claims - C# uses these claim type URIs
        const userId = decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
            decoded?.nameid ||
            decoded?.sub;

        const userEmail = decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
            decoded?.email;

        // FIXED: Extract role from JWT
        const userRole = decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'] ||
            decoded?.role;

        const user: UserFromToken = {
            id: userId ? parseInt(userId) : undefined,
            email: userEmail,
            role: userRole, // "User" or "Admin"
        };

        return {
            data: user,
            status: 200
        };
    }

    // Error handler
    private handleError(error: any): ApiResponse {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ error?: string; errors?: Record<string, string[]>; message?: string }>;

            const errorMessage =
                axiosError.response?.data?.error ||
                axiosError.response?.data?.message ||
                axiosError.message ||
                'An error occurred';

            console.error('🚨 API Client Error:', {
                status: axiosError.response?.status,
                message: errorMessage,
                url: axiosError.config?.url
            });

            return {
                error: errorMessage,
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