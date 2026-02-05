import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_PATHS } from '../../utils/apiPath';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
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
  tagTypes: ['Booking'],
  endpoints: (builder) => ({
    getUpcomingBookings: builder.query({
      query: () => API_PATHS.BOOKINGS.GET_UPCOMING,
      providesTags: ['Booking'],
    }),
    getBookingHistory: builder.query({
      query: () => API_PATHS.BOOKINGS.GET_HISTORY,
      providesTags: ['Booking'],
    }),
    getAllBookings: builder.query({
      query: () => '/api/v1/admin/bookings',
      providesTags: ['Booking'],
    }),
    createBooking: builder.mutation({
      query: (data) => ({
        url: API_PATHS.BOOKINGS.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Booking'],
    }),
    updateBooking: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/bookings/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }, 'Booking'],
    }),
    cancelBooking: builder.mutation({
      query: (bookingId) => ({
        url: API_PATHS.BOOKINGS.CANCEL,
        method: 'POST',
        body: { bookingId },
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useGetUpcomingBookingsQuery,
  useGetBookingHistoryQuery,
  useGetAllBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useCancelBookingMutation,
} = bookingApi;
