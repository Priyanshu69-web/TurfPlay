import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api/v1';

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: (builder) => ({
    submitContact: builder.mutation({
      query: (contactData) => ({
        url: '/contact/submit',
        method: 'POST',
        body: contactData,
      }),
    }),
  }),
});

export const { useSubmitContactMutation } = contactApi;
