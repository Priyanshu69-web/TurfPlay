import React, { createContext, useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, logout as reduxLogout, initializeAuth } from '../redux/slices/authSlice';
import { useGetUserQuery } from '../redux/api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { user, loading, isAuthenticated } = useSelector(state => state.auth);
    const token = localStorage.getItem("token");
    const { data: userData, isLoading: isFetching } = useGetUserQuery(undefined, {
        skip: !token,
    });

    useEffect(() => {
        if (token) {
            dispatch(setLoading(true));
            // Initialize auth from stored token
            const initAuth = async () => {
                try {
                    // Token is valid, auth will be initialized from the stored token
                    if (userData?.user) {
                        dispatch(initializeAuth({
                            user: userData.user,
                            token: token
                        }));
                    }
                } catch (err) {
                    console.error("Auth check failed", err.message);
                    localStorage.removeItem("token");
                    dispatch(reduxLogout());
                } finally {
                    dispatch(setLoading(false));
                }
            };
            initAuth();
        } else {
            dispatch(setLoading(false));
        }
    }, [dispatch, token]);

    const login = async (token) => {
        localStorage.setItem("token", token);
        dispatch(setLoading(true));
        // The Redux state will be updated by the login mutation
        dispatch(setLoading(false));
        return user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        dispatch(reduxLogout());
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading: loading || isFetching, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
