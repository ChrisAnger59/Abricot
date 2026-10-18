export interface User {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
}

export interface FieldError {
    field: string;
    message: string;
}

export interface ApiSuccess<T> {
    success: true;
    message: string;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    error: string;
    data?: {
        errors: FieldError[];
    }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface AuthData {
    user: User;
    token: string;
}

export interface ProfileData {
    user: User;
}