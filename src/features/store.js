import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import requestReducer from '../features/request/requestSlice';
import homeReducer from '../features/home/homeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    request: requestReducer,
    home: homeReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
