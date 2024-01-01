import { AlertColor } from '@mui/material'

// toast types

export interface ToastState {
  open?: boolean;
  type?: AlertColor;
  message: string;
  timeout?: number | null;
}

// theme types

export interface ThemeState {
  darkMode: boolean
}

// auth types

export interface Credentials {
  username: string,
  password: string
}

export interface Message {
  message: string
}

export interface UserData {
  id: number,
  username: string,
}

export interface AuthState {
  user: UserData | null,
  token: string | null
}

// thread types

export interface Base {
  id: number
  created_at: string
  updated_at: string
}

export interface Category extends Base {
  name: string
}

export interface User extends Base {
  username: string
}

export interface Comment extends Base {
  content: string
  creator: User
  thread_id: number
}

export interface Thread extends Base {
  title: string
  description: string
  category: Category
  creator: User
  comments: Comment[] | null
  edited_at: string
}

export interface ThreadsRes {
  threads: Thread[]
  count: number
}

export interface ThreadsReq {
  id: number
  title: string
  page: number
}

export interface ThreadReq extends Partial<Thread> {
  user_id: number,
  category_id: number
}

// comment types

export interface CommentReq extends Partial<Comment> {
  user_id: number,
}

export interface DeleteCommentReq {
  comment_id: number,
  thread_id: number
}
