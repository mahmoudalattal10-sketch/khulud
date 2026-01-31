import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI, User, TokenManager } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check login status on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = TokenManager.get();
                if (token) {
                    try {
                        const response = await AuthAPI.verify();
                        if (response.success && response.data?.user) {
                            // The verify endpoint returns a simplified user object (from token)
                            // Let's fetch the full profile to get the name/role correctly if needed,
                            // or just trust the token data if it's sufficient.
                            // For now, let's use the verify data, but cast it to User. 
                            // Ideally verify should return the full user or we call profile().

                            // Let's fetch full profile to be safe and get fresh data
                            const profileRes = await AuthAPI.profile();
                            if (profileRes.success && profileRes.data?.user) {
                                setUser(profileRes.data.user);
                            } else {
                                // Verify succeeded but profile failed? Fallback to token data
                                // or layout might be undefined
                                setUser(response.data.user as unknown as User);
                            }
                        } else {
                            TokenManager.remove();
                        }
                    } catch (e) {
                        console.error("Token verification failed", e);
                        TokenManager.remove();
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (token: string, newUser: User) => {
        TokenManager.set(token);
        setUser(newUser);
    };

    const logout = async () => {
        await AuthAPI.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const profileRes = await AuthAPI.profile();
            if (profileRes.success && profileRes.data?.user) {
                setUser(profileRes.data.user);
            }
        } catch (e) {
            console.error("Failed to refresh user", e);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
