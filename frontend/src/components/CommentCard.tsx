import { Box, Button, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import AvatarIcon from './AvatarIcon'
import { TimeFromNow } from '../helpers'
import { Comment, UserData } from '../redux/types'
import { MoreVert } from '@mui/icons-material'
import { useState } from 'react'
import { useDeleteCommentMutation, useEditCommentMutation } from '../redux/api/commentApiSlice'
import useToast from './hooks/UseToast'

interface Props {
  comment: Comment
  user: UserData
}

export default function CommentCard({ comment, user }: Props) {
  const [deleteComment, { isLoading: deletingComment }] = useDeleteCommentMutation()
  const [editComment, { isLoading: editingComment }] = useEditCommentMutation()
  const { displayToast } = useToast()
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false)
  const [commentContent, setCommentContent] = useState<string>(comment.content)
  const [anchorElOption, setAnchorElOption] = useState<null | HTMLElement>(null)

  const handleOpenCommentMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElOption(event.currentTarget);
  }

  const handleCloseCommentMenu = () => {
    setAnchorElOption(null);
  }

  const handleCommentDelete = async () => {
    try {
      handleCloseCommentMenu()
      await deleteComment({ comment_id: comment.id, thread_id: comment.thread_id }).unwrap()
      displayToast({ message: 'Comment deleted successfully', type: 'success' })
    } catch (err) {
      displayToast({ message: `Unable to delete comment: ${err}`, type: 'error' })
    }
  }

  const handleEditButtonClick = () => {
    handleCloseCommentMenu()
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setCommentContent(comment.content)
  }

  const handleCommentEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (formData.get(`comment-${comment.id}`) === null) {
      displayToast({ message: 'Please type a comment before submitting.', type: 'error' })
      return
    }
    const commentInput = formData.get(`comment-${comment.id}`) as string
    if (commentInput === comment.content) {
      setIsEditMode(false)
      return
    }

    try {
      await editComment({ id: comment.id, thread_id: comment.thread_id, user_id: user.id, content: commentInput }).unwrap()
      displayToast({ message: 'Comment edited successfully', type: 'success' })
      setIsEditMode(false)
    } catch (err) {
      displayToast({ message: `Unable to edit comment: ${err}`, type: 'error' })
    }
  }

  const isCreator = user.id === comment.creator.id

  return (
    <CardContent>
      <Box display='flex' flexDirection='row'>
        <Box marginTop={isCreator ? 2 : 0}>
          <AvatarIcon name={comment.creator.username} />
        </Box>
        <Box display='flex' flexDirection='column' marginLeft={2} flexGrow={1}>
          <Box display='flex' flexDirection='row' alignItems='baseline'>
            <Typography fontWeight='bold'>
              {isCreator ? 'You' : comment.creator.username} 
            </Typography>
            <Typography paddingLeft={1} variant='body2'>
              {TimeFromNow(comment.created_at)}
              {comment.created_at !== comment.updated_at ? ' (edited)' : null}
            </Typography>
            {
              isCreator
              ? <>
                  <Tooltip title='Open menu'>
                    <IconButton onClick={handleOpenCommentMenu} sx={{ marginLeft: 'auto' }}>
                      <MoreVert />
                    </IconButton>
                  </Tooltip> 
                  <Menu
                    anchorEl={anchorElOption}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElOption)}
                    onClose={handleCloseCommentMenu}
                  >
                    <MenuItem onClick={handleEditButtonClick}>Edit</MenuItem>
                    <MenuItem onClick={() => setDeleteConfirmOpen(true)} disabled={deletingComment}>Delete</MenuItem>
                  </Menu>

                  <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                    <Box component='form' onSubmit={handleCommentDelete}>
                      <DialogTitle>Are you sure you want to delete this comment?</DialogTitle>
                      <DialogContent>
                        <Typography>This action cannot be undone.</Typography>
                      </DialogContent>
                      <DialogActions>
                        <Button variant='outlined' color='error' onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button type='submit' variant='contained' color='error'>{deletingComment ? <CircularProgress color='inherit' size={25} /> : 'Delete'}</Button>
                      </DialogActions>
                    </Box>
                  </Dialog>
                </>
              : null
            }
          </Box>
          {
            isEditMode ?
            <Box component='form' onSubmit={handleCommentEdit} display='flex' flexDirection='column'>
              <TextField 
                required 
                fullWidth 
                multiline 
                maxRows={3} 
                id={`comment-${comment.id}`} 
                name={`comment-${comment.id}`} 
                value={commentContent} 
                onChange={e => setCommentContent(e.target.value)} 
                variant='standard'
                autoFocus 
              />
              <Box display='flex' flexDirection='row' justifyContent='flex-end' marginTop={1}>
                <Button onClick={handleCancelEdit} variant='outlined' size='small' sx={{ marginRight: 1 }}>Cancel</Button>
                <Button type='submit' variant='contained' size='small' disabled={editingComment}>Save</Button>
              </Box>
            </Box> : 
            <Typography>
              {comment.content}
            </Typography>
          }
        </Box>
      </Box>
    </CardContent>
  )
}