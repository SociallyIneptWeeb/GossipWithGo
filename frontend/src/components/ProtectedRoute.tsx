import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useUserQuery } from '../redux/api/authApiSlice'
import { CircularProgress } from '@mui/material'

export default function ProtectedRoute() {
  // query stores token in state if user is authenticated
  const { isLoading } = useUserQuery()

  const token = useSelector((state: RootState) => state.auth.token)
  const location = useLocation()

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    token
      ? <Outlet />
      : <Navigate to='/login' state={{from: location}} replace />
  )
}
