import { apiSlice } from "./apiSlice"
import { Comment, CommentReq, DeleteCommentReq, Message } from "../types"

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createComment: builder.mutation<Comment, CommentReq>({
      query: body => ({
        url: '/comment',
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error, { thread_id }) => [{ type: 'Threads', id: thread_id }, { type: 'Threads', id: 'LIST' }]
    }),
    deleteComment: builder.mutation<Message, DeleteCommentReq>({
      query: ({ comment_id }) => ({
        url: `/comment/${comment_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { thread_id }) => [{ type: 'Threads', id: thread_id }, { type: 'Threads', id: 'LIST' }]
    }),
    editComment: builder.mutation<Comment, CommentReq>({
      query: body => ({
        url: `/comment/${body.id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error, { thread_id }) => [{ type: 'Threads', id: thread_id }]
    })
  })
})

export const {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
} = commentApiSlice