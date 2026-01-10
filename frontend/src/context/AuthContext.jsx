import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { logout as reduxLogout } from '../redux/slices/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { user, loading, isAuthenticated } = useSelector(state => state.auth);

    const logout = () => {
        localStorage.removeItem("token");
        reduxLogout();
    };

    return (
        <AuthContext.Provider value={{ user, logout, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
