export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}
