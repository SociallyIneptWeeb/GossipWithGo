import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useCreateThreadMutation, useGetThreadsQuery } from '../redux/api/threadApiSlice'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Pagination, Radio, RadioGroup, Select, Stack, TextField, Typography } from '@mui/material'
import Error from './Error'
import ThreadCard from '../components/ThreadCard'
import { AddCircleOutlineRounded } from '@mui/icons-material'
import useToast from '../components/hooks/UseToast'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const [formModelOpen, setFormModelOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState(0)
  const [searchFilter, setSearchFilter] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 5
  const { displayToast } = useToast()

  const { data, isLoading, isError } = useGetThreadsQuery({id: categoryFilter, title: searchFilter, page: pageNumber})
  const [ createThread, { isLoading: isCreating } ] = useCreateThreadMutation()

  if (user === null) {
    return <Error message='You must be logged in to view the home page.' />
  }

  if (isError) {
    return <Error message='Unable to load threads' />
  }

  if (isLoading) {
    return <CircularProgress />
  }

  const handleCreateThread = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') === null ? '' : formData.get('title') as string
    const description = formData.get('description') === null ? '' : formData.get('description') as string
    const categoryId = formData.get('category') === null ? 1 : parseInt(formData.get('category') as string)

    try {
      const data = await createThread({ title, description, category_id: categoryId, user_id: user.id }).unwrap()
      displayToast({ message: `Successfully created thread!`, type: 'success' })
      navigate(`/thread/${data.id}`)
    } catch (err) {
      displayToast({ message: 'Unable to create thread', type: 'error' })
      console.error(err)
    }
  }

  return (
    <Box display='flex' flexDirection='column' marginTop={1}>
      <Box display='flex' flexDirection='row' alignItems='center' marginBottom={1}>
        <Typography variant='h6'>Recent Activity</Typography>
        <Button onClick={() => setFormModelOpen(true)} variant='contained' sx={{ marginLeft: 'auto' }}>
          <AddCircleOutlineRounded sx={{ marginRight: 1 }} /> New Thread
        </Button>
      </Box>
      <Divider />
      <Dialog open={formModelOpen} onClose={() => setFormModelOpen(false)}>
        <Box component='form' onSubmit={handleCreateThread}>
          <DialogTitle>New Thread</DialogTitle>
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
            />
            <FormControl sx={{ marginTop: 2 }}>
              <FormLabel required>Category</FormLabel>
              <RadioGroup row defaultValue={1} name='category'>
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
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormModelOpen(false)}>Cancel</Button>
            <Button variant='contained' type='submit'>{isCreating ? <CircularProgress size={25} color='inherit' /> : 'Create'}</Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Stack spacing={{ xs: 1, sm: 2 }} direction='row' useFlexGap flexWrap='wrap' alignItems='flex-end'>
        <FormControl sx={{ maxWidth: 'fit-content', marginTop: 1 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value as number)}
          >
            <MenuItem value={0}>All Categories</MenuItem>
            <MenuItem value={1}>General</MenuItem>
            <MenuItem value={2}>Fight me</MenuItem>
            <MenuItem value={3}>Just curious</MenuItem>
          </Select>
        </FormControl>
        <TextField label='Search by title' variant='outlined' value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
      </Stack>
      <Stack spacing={2} mt={2} divider={<Divider />}>
        {
          data?.threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} user={user}/>
          ))
        }
      </Stack>
      {
        data?.count !== undefined ? data.count === 0 
        ? <Typography variant='h6' sx={{ marginTop: 2 }}>No threads found</Typography>
        : <Pagination count={Math.ceil(data?.count / pageSize)} page={pageNumber} onChange={(e, page) => setPageNumber(page)} sx={{ marginTop: 2, marginLeft: 'auto' }} />
        : <Typography variant='h6' sx={{ marginTop: 2 }}>Unable to fetch threads</Typography>
      }
    </Box>
  )
}