import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // On initial load, check if a valid token exists in localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Check if token is expired
                if (decodedToken.exp * 1000 > Date.now()) {
                    setUser({
                        token,
                        username: decodedToken.sub,
                        roles: decodedToken.roles || [], // <-- This correctly reads the roles
                    });
                } else {
                    localStorage.removeItem('token'); // Clean up expired token
                }
            } catch (error) {
                console.error("Invalid token found in localStorage", error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setUser({
            token,
            username: decodedToken.sub,
            roles: decodedToken.roles || [], // <-- This correctly reads the roles
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};