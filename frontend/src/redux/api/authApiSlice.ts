import { AuthState, Credentials, Message } from "../types"
import { apiSlice } from "./apiSlice"

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<AuthState, Credentials>({
      query: body => ({
        url: '/auth/login',
        method: 'POST',
        body
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      })
    }),
    register: builder.mutation<Message, Credentials>({
      query: body => ({
        url: '/auth/register',
        method: 'POST',
        body
      })
    }),
    user: builder.query<AuthState, void>({
      query: () => ({
        url: '/auth/user',
        method: 'GET'
      })
    })
  })
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUserQuery,
} = authApiSlice