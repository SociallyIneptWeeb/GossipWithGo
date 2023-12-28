import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AuthState } from './types';

const initialState: AuthState = {
  user: null,
  token: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLogout: state => {
      state.user = null
      state.token = null
    },
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      const {user, token} = action.payload
      state.user = user
      state.token = token
    }
  },
});

export const { userLogout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
