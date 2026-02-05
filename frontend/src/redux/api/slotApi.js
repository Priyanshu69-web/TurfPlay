import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_PATHS } from '../../utils/apiPath';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';

export const slotApi = createApi({
  reducerPath: 'slotApi',
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
  tagTypes: ['Slot'],
  endpoints: (builder) => ({
    getSlots: builder.query({
      query: () => API_PATHS.SLOTS.GET_AVAILABLE,
      providesTags: ['Slot'],
    }),
    generateSlots: builder.mutation({
      query: (data) => ({
        url: API_PATHS.SLOTS.GENERATE_NEXT_DAYS,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Slot'],
    }),
    updateSlot: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/slots/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Slot', id }, 'Slot'],
    }),
  }),
});

export const {
  useGetSlotsQuery,
  useGenerateSlotsMutation,
  useUpdateSlotMutation,
} = slotApi;
