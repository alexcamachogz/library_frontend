import React, { createContext, useContext, useState, useEffect } from 'react';
import type { GoogleUser, AuthContextType } from '../../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<GoogleUser | null>(null);

    useEffect(() => {
        // Load user from localStorage on app start
        const storedUser = localStorage.getItem('googleUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('googleUser');
            }
        }
    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('googleUser');
    };

    const isAuthenticated = user !== null;

    const value: AuthContextType = {
        user,
        setUser,
        isAuthenticated,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};