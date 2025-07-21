import React, { createContext, useState, useEffect } from 'react';
import { saveToken, removeToken, getUserFromToken } from '../services/authStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const user = await getUserFromToken();
                if (user) {
                    setUserToken(user.token);
                }
            } catch (e) {
                console.error("Token kontrolü hatası:", e);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const login = async (token) => {
        setIsLoading(true);
        await saveToken(token);
        setUserToken(token);
        setIsLoading(false);
    };

    const logout = async () => {
        setIsLoading(true);
        await removeToken();
        setUserToken(null);
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ login, logout, userToken, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
