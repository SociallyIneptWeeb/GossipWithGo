import { BaseQueryApi, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, userLogout } from '../authSlice'
import { RootState } from '../store'
import { FetchArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery'
import { AuthState } from '../types'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  // baseUrl: 'http://localhost:3001/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    if (token) {
      headers.set('authorization', `bearer ${token}`)
    }
    return headers
  }
})

const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) {
    // renew access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

    if (refreshResult?.data) {
      const data = refreshResult.data as AuthState
      api.dispatch(setCredentials({ ...data}))
      
      // retry
      result = await baseQuery(args, api, extraOptions)
    } else {
      // refresh token expired
      api.dispatch(userLogout())
    }
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Threads'],
  endpoints: builder => ({})
})