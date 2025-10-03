"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { fetchUser, user, isAuth, logout, editUser } = useAuthStore();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const init = async () => {
            await fetchUser();
            setLoading(false);
        };
        init();
    }, [fetchUser]);
    return (
        <AuthContext.Provider value={{ user, isAuth, loading, logout, editUser }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};