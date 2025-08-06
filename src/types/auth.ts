export interface GoogleUser {
    id: string;
    name: string;
    email: string;
    picture: string;
}

export interface AuthContextType {
    user: GoogleUser | null;
    setUser: (user: GoogleUser | null) => void;
    isAuthenticated: boolean;
    logout: () => void;
}