import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout as reduxLogout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { user, loading, isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const logout = () => {
        localStorage.removeItem("token");
        dispatch(reduxLogout());
    };

    return (
        <AuthContext.Provider value={{ user, logout, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
