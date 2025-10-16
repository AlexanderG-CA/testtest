// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { UserFromToken } from '@/lib/api-client';

interface AuthContextType {
    user: UserFromToken | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isAdmin: boolean;
    showLoginPopup: boolean;
    setShowLoginPopup: (show: boolean) => void;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserFromToken | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false);
    const router = useRouter();

    // FIXED: Check role from JWT claim instead of email
    const isAdmin = user?.role === 'Admin';

    // Check authentication status on mount
    const checkAuthStatus = useCallback(async () => {
        try {
            const response = await authService.checkAuth();

            if (response.data) {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    // FIXED: Login function with proper user object
    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await authService.login({ email, password });

            if (response.error) {
                return { success: false, error: response.error };
            }

            if (response.data) {
                // Get user from token after login
                const userResponse = await authService.checkAuth();
                if (userResponse.data) {
                    setUser(userResponse.data);
                    setShowLoginPopup(false);
                    router.push('/profile');
                    return { success: true };
                }
            }

            return { success: false, error: 'Unknown error occurred' };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Login failed'
            };
        }
    };

    // FIXED: Register function - auto-login after registration
    const register = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await authService.register({ email, password });

            if (response.error) {
                return { success: false, error: response.error };
            }

            // Auto-login after registration
            const userResponse = await authService.checkAuth();
            if (userResponse.data) {
                setUser(userResponse.data);
                setShowLoginPopup(false);
                router.push('/profile');
                return { success: true };
            }

            return { success: true }; // Registration succeeded even if auto-login fails
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Registration failed'
            };
        }
    };

    // Logout function
    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            router.push('/');
        }
    };

    // Refresh user data
    const refreshUser = async (): Promise<void> => {
        try {
            const response = await authService.checkAuth();

            if (response.data) {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin,
        showLoginPopup,
        setShowLoginPopup,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// HOC for protected routes
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    requireAdmin = false
) {
    return function AuthenticatedComponent(props: P) {
        const { isAuthenticated, isAdmin, isLoading, setShowLoginPopup } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading) {
                if (!isAuthenticated) {
                    setShowLoginPopup(true);
                } else if (requireAdmin && !isAdmin) {
                    router.push('/');
                }
            }
        }, [isAuthenticated, isAdmin, isLoading, router, setShowLoginPopup]);

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#171010" }}>
                    <div className="animate-spin h-12 w-12 border-4 rounded-full"
                        style={{ borderColor: "#362222", borderTopColor: "transparent" }} />
                </div>
            );
        }

        if (!isAuthenticated || (requireAdmin && !isAdmin)) {
            return null;
        }

        return <Component {...props} />;
    };
}