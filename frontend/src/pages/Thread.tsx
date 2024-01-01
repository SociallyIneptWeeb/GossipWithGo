import { useNavigate, useParams } from 'react-router-dom'
import Error from './Error'
import { useDeleteThreadMutation, useEditThreadMutation, useGetThreadQuery } from '../redux/api/threadApiSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { TimeFromNow, ToDateString } from '../helpers'
import CategoryIcon from '../components/CategoryIcon'
import AvatarIcon from '../components/AvatarIcon'
import CommentCard from '../components/CommentCard'
import { useCreateCommentMutation } from '../redux/api/commentApiSlice'
import useToast from '../components/hooks/UseToast'
import { Delete, Edit } from '@mui/icons-material'
import { useState } from 'react'

export default function Thread() {
  let threadId = useParams().threadId

  const [ deleteConfirmOpen, setDeleteConfirmOpen ] = useState(false)
  const [ editFormOpen, setEditFormOpen ] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)
  const navigate = useNavigate()
  const { displayToast } = useToast()
  const { data: thread, isLoading, isError } = useGetThreadQuery(threadId === undefined ? '' : threadId)
  const [ createComment, { isLoading: creatingComment } ] = useCreateCommentMutation()
  const [ deleteThread, { isLoading: deletingThread } ] = useDeleteThreadMutation()
  const [ editThread, { isLoading: editingThread } ] = useEditThreadMutation()
  const [ threadTitle, setThreadTitle ] = useState(thread?.title)
  const [ threadDescription, setThreadDescription ] = useState(thread?.description)

  if (threadId === undefined) {
    return <Error message='Could not get Thread ID' />
  }

  if (user === null) {
    return <Error message='You must be logged in to view the home page.' />
  }

  if (isError) {
    return <Error message='Unable to load thread' />
  }

  if (isLoading || thread === undefined) {
    return <CircularProgress />
  }

  const handleCommentCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (formData.get('comment') === null) {
      displayToast({ message: 'Please type a comment before submitting.', type: 'error' })
      return
    }
    const commentInput = formData.get('comment') as string

    try {
      await createComment({ thread_id: thread.id, content: commentInput, user_id: user.id }).unwrap()
      displayToast({ message: 'Comment created successfully', type: 'success' })
    } catch (err) {
      displayToast({ message: `Unable to create comment: ${err}`, type: 'error' })
    }
  }

  const handleDeleteThread = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await deleteThread(thread.id).unwrap()
      displayToast({ message: 'Thread deleted successfully', type: 'success' })
      navigate('/')
    } catch (err) {
      displayToast({ message: `Unable to delete thread: ${err}`, type: 'error' })
    }
  }

  const handleEditThread = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') === null ? '' : formData.get('title') as string
    const description = formData.get('description') === null ? '' : formData.get('description') as string
    const categoryId = formData.get('category') === null ? 1 : parseInt(formData.get('category') as string)

    try {
        await editThread({ id: thread.id, title, description, category_id: categoryId, user_id: user.id }).unwrap()
        displayToast({ message: 'Thread edited successfully', type: 'success' })
        setEditFormOpen(false)
    } catch (err) {
        displayToast({ message: `Unable to edit thread: ${err}`, type: 'error' })
    }
  }

  const isCreator = user.id === thread.creator.id

  return (
    <>
      <Card sx={{ boxShadow: 3, marginTop: 2 }}>
        {
          isCreator ? 
          <>
            <Box display='flex' flexDirection='row' paddingRight={1} paddingTop={1}>
              <IconButton sx={{ marginLeft: 'auto' }} onClick={() => setEditFormOpen(true)}>
                <Edit color='primary' />
              </IconButton>
              <IconButton onClick={() => setDeleteConfirmOpen(true)}>
                <Delete color='error' />
              </IconButton>
            </Box>

            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
              <Box component='form' onSubmit={handleDeleteThread}>
                <DialogTitle>Are you sure you want to delete this thread?</DialogTitle>
                <DialogContent>
                  <Typography>This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                  <Button variant='outlined' color='error' onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                  <Button type='submit' variant='contained' color='error'>{deletingThread ? <CircularProgress color='inherit' size={25} /> : 'Delete'}</Button>
                </DialogActions>
              </Box>
            </Dialog>

            <Dialog open={editFormOpen} onClose={() => setEditFormOpen(false)}>
              <Box component='form' onSubmit={handleEditThread}>
                <DialogTitle>Edit Thread</DialogTitle>
                <DialogContent>
                  <TextField 
                    autoFocus
                    id='title'
                    name='title'
                    label='Title'
                    type='text'
                    fullWidth
                    required
                    variant='standard'
                    value={threadTitle}
                    onChange={(event) => setThreadTitle(event.target.value)}
                  />
                  <FormControl sx={{ marginTop: 2 }}>
                    <FormLabel required>Category</FormLabel>
                    <RadioGroup row defaultValue={thread.category.id} name='category'>
                      <FormControlLabel value={1} control={<Radio />} label='General' />
                      <FormControlLabel value={2} control={<Radio />} label='Fight me' />
                      <FormControlLabel value={3} control={<Radio />} label='Just curious' />
                    </RadioGroup>
                  </FormControl>
                  <TextField 
                    id='description'
                    name='description'
                    label='Description'
                    type='text'
                    fullWidth
                    required
                    multiline
                    maxRows={3}
                    variant='standard'
                    value={threadDescription}
                    onChange={(event) => setThreadDescription(event.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setEditFormOpen(false)}>Cancel</Button>
                  <Button variant='contained' type='submit'>{editingThread ? <CircularProgress size={25} color='inherit' /> : 'Edit'}</Button>
                </DialogActions>
              </Box>
            </Dialog>
          </> : null
        }
        
        <Typography fontWeight='bold' variant='h4' textAlign='center' padding={1}>
          {thread.title}
        </Typography>
     
        <Divider />
        <Box display='flex' flexDirection={{xs: 'column', sm: 'row'}}>
          <Box display='flex' flexDirection='column' padding={3} alignItems='center' minWidth='fit-content' justifyContent='center'>
            <AvatarIcon name={thread.creator.username} />
            <Typography variant='subtitle1'>
              {isCreator ? 'You' : thread.creator.username}
            </Typography>
            <Typography variant='subtitle2'>
              Joined {ToDateString(thread.creator.created_at)}
            </Typography>
          </Box>

          <Divider orientation='vertical' flexItem />
          <Divider />

          <Box display='flex' flexDirection='column' flexGrow={1}>
            <Typography padding={2}>
              {thread.description} 
            </Typography>
            <Typography textAlign='right' marginTop='auto' variant='subtitle2' padding={2}>
              Created {TimeFromNow(thread.created_at)} {thread.created_at !== thread.edited_at ? '(edited)' : null}
            </Typography>
          </Box>
        </Box>
      </Card>

      <Card sx={{ marginTop: 2, boxShadow: 3 }}>
        <CardContent>
          <Box display='flex' flexDirection='row'>
            <Typography variant='h6' fontWeight='bold' marginRight='auto'>
            {thread.comments !== null ? thread.comments.length : 0} Comments
            </Typography>
            <Box display='flex' flexDirection='row' alignItems='center'>
              <Typography fontWeight='bold'>{thread.category.name}</Typography>
              <CategoryIcon name={thread.category.name} props={{ fontSize: 'large' }} />
            </Box>
          </Box>
        </CardContent>
        <Divider variant='middle' />
        <CardContent>
          <Box component='form' onSubmit={handleCommentCreate} display='flex' flexDirection='column'>
            <Box display='flex' flexDirection='row' alignItems='baseline'>
              <AvatarIcon name={user.username} />
              {
                creatingComment 
                ? <Box display='flex' alignSelf='center' marginLeft={2}>
                    <CircularProgress />
                  </Box>
                : <TextField required fullWidth multiline maxRows={3} id='comment' label='Add a comment...' name='comment' variant='standard' sx={{ marginLeft: 2 }} />
              } 
            </Box>
            <Box display='flex' marginTop={1}>
              <Button type='submit' disabled={creatingComment} variant='contained' size='small' sx={{ marginLeft: 'auto' }}>Comment</Button>
            </Box>
          </Box>
        </CardContent>
        {
          thread.comments !== null ? thread.comments.map((comment) => (
           <CommentCard key={comment.id} comment={comment} user={user} />
          )) : null
        }
      </Card>
    </>
  )
}