import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { Toast } from './components/Toast'
import Thread from './pages/Thread'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store'

export default function App() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Toast />
      <Container maxWidth='xl' sx={{ marginBottom: 1 }}>
        <Routes>
          {/* public routes */}
          <Route path='/' element={<Layout />}>
            <Route path ='login' element={<Login />} />
            <Route path ='register' element={<Register />} />
          </Route>
          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path='thread/:threadId' element={<Thread />} />
          </Route>
        </Routes>
      </Container>
    </ThemeProvider>
  )
}