import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { authApi } from './api/authApi';
import { contactApi } from './api/contactApi';
import { turfApi } from './api/turfApi';
import { slotApi } from './api/slotApi';
import { bookingApi } from './api/bookingApi';
import { adminApi } from './api/adminApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [turfApi.reducerPath]: turfApi.reducer,
    [slotApi.reducerPath]: slotApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      contactApi.middleware,
      turfApi.middleware,
      slotApi.middleware,
      bookingApi.middleware,
      adminApi.middleware
    ),
});

export default store;
