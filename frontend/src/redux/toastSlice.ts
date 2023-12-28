import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ToastState } from "./types"

export const ToastInitialState: ToastState = {
  open: false,
  type: 'info',
  message: '',
  timeout: 5000
}

export const ToastSlice = createSlice({
  name: 'Toast',
  initialState: ToastInitialState,
  reducers: {
    addToast: (_state, action: PayloadAction<ToastState>) => ({
      ...ToastInitialState,
      ...action.payload,
      open: true
    }),
    clearToast: (state) => ({ ...state, open: false })
  }
})

export const ToastActions = ToastSlice.actions
export default ToastSlice.reducer
