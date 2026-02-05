import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';

export const adminApi = createApi({
  reducerPath: 'adminApi',
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
  tagTypes: ['AdminStats', 'User', 'Message'],
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => '/api/v1/admin/stats',
      providesTags: ['AdminStats'],
    }),
    getUsers: builder.query({
      query: () => '/api/v1/admin/users',
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User'],
    }),
    getMessages: builder.query({
      query: () => '/api/v1/admin/messages',
      providesTags: ['Message'],
    }),
    updateMessage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/messages/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Message', id }, 'Message'],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/api/v1/admin/messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Message'],
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useGetMessagesQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = adminApi;
