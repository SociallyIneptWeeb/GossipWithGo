import { apiSlice } from "./apiSlice"
import { Message, Thread, ThreadReq } from "../types"

export const threadApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getThreads: builder.query<Thread[], number>({
      query: (categoryId) => ({
        url: '/threads',
        method: 'GET',
        params: { id: categoryId }
      }),
      providesTags: (result, error) => [{ type: 'Threads', id: 'LIST' }]
    }),
    getThread: builder.query<Thread, string>({
      query: id => ({
        url: `/thread/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Threads', id }]
    }),
    createThread: builder.mutation<Thread, ThreadReq>({
      query: body => ({
        url: '/thread',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Threads', id: 'LIST' }]
    }),
    deleteThread: builder.mutation<Message, number>({
      query: id => ({
        url: `/thread/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error) => [{ type: 'Threads', id: 'LIST' }]
    }),
    editThread: builder.mutation<Thread, ThreadReq>({
      query: body => ({
        url: `/thread/${body.id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Threads', id: 'LIST' }, { type: 'Threads', id}]
    })
  })
})

export const {
  useGetThreadsQuery,
  useGetThreadQuery,
  useCreateThreadMutation,
  useDeleteThreadMutation,
  useEditThreadMutation,
} = threadApiSlice