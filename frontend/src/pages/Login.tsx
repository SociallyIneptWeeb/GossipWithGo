import React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import LoginIcon from '@mui/icons-material/Login'
import { useNavigate } from 'react-router-dom'
import { setCredentials } from '../redux/authSlice'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '../redux/api/authApiSlice'
import { CircularProgress } from '@mui/material'
import useToast from '../components/hooks/UseToast'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { displayToast } = useToast()

  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') === null ? '' : formData.get('username') as string
    const password = formData.get('password') === null ? '' : formData.get('password') as string

    try {
      const userData = await login({ username, password }).unwrap()
      dispatch(setCredentials({ ...userData }))
      displayToast({ message: 'Login successful!', type: 'success' })
      navigate('/')
    } catch (err) {
      displayToast({ message: 'Your username or password is incorrect', type: 'error' })
      console.error(err)
    }
  }

  return (
    <Container component='main' maxWidth='xs'> 
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LoginIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Login to your account
        </Typography>
        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
            autoFocus
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            { isLoading ? <CircularProgress color='inherit' /> : 'Login' } 
          </Button>
          <Box sx={{ display: 'flex'}}>
            <Link href='/register' variant='body2' sx={{ml: 'auto'}}>
              {"Don't have an account? Register here"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}