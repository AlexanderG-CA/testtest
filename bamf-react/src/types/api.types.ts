export interface User {
    id: number;
    email: string;
    cart?: string;
}

export interface Admin {
    id: number;
    userName: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    confirmPassword: string;
}