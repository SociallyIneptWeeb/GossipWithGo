import React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../redux/api/authApiSlice'
import { CircularProgress } from '@mui/material'
import useToast from '../components/hooks/UseToast'

export default function Register() {
  const navigate = useNavigate()
  const { displayToast } = useToast()
  const [register, { isLoading }] = useRegisterMutation()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') === null ? '' : formData.get('username') as string
    const password = formData.get('password') === null ? '' : formData.get('password') as string
    const rePassword = formData.get('retype-password') === null ? '' : formData.get('retype-password') as string
    
    if (password !== rePassword) {
      displayToast({ message: 'Please ensure that your password is typed correctly', type: 'error' })
      return
    }

    try {
      await register({ username, password }).unwrap()
      displayToast({ message: 'Account created successfully. Please login to continue.', type: 'success' })
      navigate('/login')
    } catch (err) {
      displayToast({ message: 'The username is already taken. Please use a different one.', type: 'error' })
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
          <AppRegistrationIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Register a new account
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
          <TextField
            margin='normal'
            required
            fullWidth
            name='retype-password'
            label='Retype Password'
            type='password'
            id='retype-password'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            { isLoading ? <CircularProgress color='inherit' /> : 'Register' } 
          </Button>
          <Box sx={{ display: 'flex'}}>
            <Link href='/login' variant='body2' sx={{ml: 'auto'}}>
              {'Already have an account? Login here'}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}