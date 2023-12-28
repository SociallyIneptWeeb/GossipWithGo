import { createSlice } from "@reduxjs/toolkit"
import { ThemeState } from "./types"

const initialState: ThemeState = {
  darkMode: true
}

export const ThemeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode
    }
  }
})

export const { toggleTheme } = ThemeSlice.actions
export default ThemeSlice.reducer
