import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_PATHS } from '../../utils/apiPath';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';

export const turfApi = createApi({
  reducerPath: 'turfApi',
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
  tagTypes: ['Turf'],
  endpoints: (builder) => ({
    getTurfs: builder.query({
      query: () => "/api/v1/turf/get-turfs",
      providesTags: ['Turf'],
    }),
    getTurfById: builder.query({
      query: (id) => `/api/v1/turf/get-turf/${id}`,
      providesTags: (result, error, id) => [{ type: 'Turf', id }],
    }),
    createTurf: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/turf/create-turf",
        method: 'POST',
        body: formData, // FormData will automatically set correct headers
      }),
      invalidatesTags: ['Turf'],
    }),
    updateTurf: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/v1/turf/update-turf/${id}`,
        method: 'PUT',
        body: body, // body is FormData here
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Turf', id }, 'Turf'],
    }),
    deleteTurf: builder.mutation({
      query: (id) => ({
        url: `/api/v1/turf/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Turf'],
    }),
  }),
});

export const {
  useGetTurfsQuery,
  useGetTurfByIdQuery,
  useCreateTurfMutation,
  useUpdateTurfMutation,
  useDeleteTurfMutation,
} = turfApi;
