import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import { apiSlice } from './api/apiSlice'
import ToastReducer from './toastSlice'
import ThemeReducer from './themeSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    toast: ToastReducer,
    theme: ThemeReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch