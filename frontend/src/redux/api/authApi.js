import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_PATHS } from '../../utils/apiPath';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
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
    logout: builder.mutation({
      query: () => ({
        url: API_PATHS.AUTH.LOGOUT,
        method: 'POST',
      }),
    }),
    getUser: builder.query({
      query: () => API_PATHS.AUTH.GET_PROFILE,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetUserQuery, useLazyGetUserQuery } = authApi;
