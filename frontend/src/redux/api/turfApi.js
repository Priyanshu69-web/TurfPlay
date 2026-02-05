import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_PATHS } from '../../utils/apiPath';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';

export const turfApi = createApi({
  reducerPath: 'turfApi',
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
  tagTypes: ['Turf'],
  endpoints: (builder) => ({
    getTurfs: builder.query({
      query: () => API_PATHS.TURF.GET_ALL,
      providesTags: ['Turf'],
    }),
    getTurfById: builder.query({
      query: (id) => `${API_PATHS.TURF.GET_ALL}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Turf', id }],
    }),
    createTurf: builder.mutation({
      query: (data) => ({
        url: API_PATHS.TURF.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Turf'],
    }),
    updateTurf: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${API_PATHS.TURF.UPDATE}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Turf', id }, 'Turf'],
    }),
    deleteTurf: builder.mutation({
      query: (id) => ({
        url: `${API_PATHS.TURF.GET_ALL}/${id}`,
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
