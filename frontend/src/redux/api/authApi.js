import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_PATHS } from '../../utils/apiPath';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem("token");
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: API_PATHS.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: API_PATHS.AUTH.REGISTER,
        method: 'POST',
        body: userData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (otpData) => ({
        url: "/api/v1/auth/verify-otp",
        method: 'POST',
        body: otpData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: API_PATHS.AUTH.LOGOUT,
        method: 'POST',
      }),
    }),
    getUser: builder.query({
      query: () => API_PATHS.AUTH.GET_PROFILE,
      method: "GET",
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: API_PATHS.AUTH.GET_PROFILE, // Assuming GET_PROFILE is the base path for profile PUT too
        method: 'PUT',
        body: userData,
      }),
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/api/v1/auth/change-password',
        method: 'POST',
        body: passwordData,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/api/v1/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    verifyResetToken: builder.mutation({
      query: (data) => ({
        url: '/api/v1/auth/verify-reset-token',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/api/v1/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useVerifyOtpMutation,
  useLogoutMutation, 
  useGetUserQuery, 
  useLazyGetUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useVerifyResetTokenMutation,
  useResetPasswordMutation,
} = authApi;
