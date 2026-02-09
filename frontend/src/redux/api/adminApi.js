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
  tagTypes: ['AdminStats', 'User', 'Message', 'Booking', 'Slot'],
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => '/api/v1/admin/stats',
      providesTags: ['AdminStats'],
    }),
    getBookings: builder.query({
      query: ({ date, status, turfId, page, limit } = {}) => {
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        if (status) params.append('status', status);
        if (turfId) params.append('turfId', turfId);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        return `/api/v1/admin/bookings?${params.toString()}`;
      },
      providesTags: ['Booking'],
    }),
    getBookingDetail: builder.query({
      query: (id) => `/api/v1/admin/bookings/${id}`,
      providesTags: ['Booking'],
    }),
    cancelBooking: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/api/v1/admin/bookings/${id}/cancel`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['Booking'],
    }),
    getUsers: builder.query({
      query: ({ page, limit, search } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);
        return `/api/v1/admin/users?${params.toString()}`;
      },
      providesTags: ['User'],
    }),
    blockUser: builder.mutation({
      query: ({ id, isBlocked, reason }) => ({
        url: `/api/v1/admin/users/${id}/block`,
        method: 'PUT',
        body: { isBlocked, reason },
      }),
      invalidatesTags: ['User'],
    }),
    getMessages: builder.query({
      query: ({ page, limit, status } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (status) params.append('status', status);
        return `/api/v1/admin/messages?${params.toString()}`;
      },
      providesTags: ['Message'],
    }),
    updateMessage: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/v1/admin/messages/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Message'],
    }),
    getSlots: builder.query({
      query: ({ turfId, date, status, page, limit } = {}) => {
        const params = new URLSearchParams();
        if (turfId) params.append('turfId', turfId);
        if (date) params.append('date', date);
        if (status) params.append('status', status);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        return `/api/v1/admin/slots?${params.toString()}`;
      },
      providesTags: ['Slot'],
    }),
    blockSlot: builder.mutation({
      query: ({ id, isBlocked, reason }) => ({
        url: `/api/v1/slots/admin/${id}/block`,
        method: 'PUT',
        body: { isBlocked, reason },
      }),
      invalidatesTags: ['Slot'],
    }),
    blockDateSlots: builder.mutation({
      query: ({ turfId, date, isBlocked, reason }) => ({
        url: `/api/v1/slots/admin/block-date`,
        method: 'PUT',
        body: { turfId, date, isBlocked, reason },
      }),
      invalidatesTags: ['Slot'],
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGetBookingsQuery,
  useGetBookingDetailQuery,
  useCancelBookingMutation,
  useGetUsersQuery,
  useBlockUserMutation,
  useGetMessagesQuery,
  useUpdateMessageMutation,
  useGetSlotsQuery,
  useBlockSlotMutation,
  useBlockDateSlotsMutation,
} = adminApi;
