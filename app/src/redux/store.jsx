import { configureStore } from '@reduxjs/toolkit';
import cotasReducer from './slices/cotasSlice';
import authSlice from './slices/authSlice';

const store = configureStore({
  reducer: {
    cotas: cotasReducer,
    auth: authSlice,
  },
});

export default store;
