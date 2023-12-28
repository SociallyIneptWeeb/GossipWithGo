import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import ForumIcon from '@mui/icons-material/Forum'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { userLogout } from '../redux/authSlice'
import { useLogoutMutation } from '../redux/api/authApiSlice'
import { CircularProgress } from '@mui/material'
import useToast from './hooks/UseToast'
import AvatarIcon from './AvatarIcon'
import { DarkMode, LightMode } from '@mui/icons-material'
import { toggleTheme } from '../redux/themeSlice'

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user)
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [logout, { isLoading }] = useLogoutMutation()
  const { displayToast } = useToast()

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  }

  const handleLogout = async () => {
    await logout({})
    dispatch(userLogout())
    handleCloseUserMenu()
    displayToast({ message: 'Logged out successfully', type: 'success' })
    return navigate('/login')
  }

  const changeTheme = () => {
    dispatch(toggleTheme())
  }

  const userOptions = ['Login', 'Register']

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Link to='/' style={{ textDecoration: 'inherit', color: 'inherit', marginRight: 'auto'}}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ForumIcon sx={{ display: 'flex', mr: 1 }} />
              <Typography
                variant='h6'
                noWrap
                sx={{
                  mr: 2,
                  display: {xs: 'none', sm: 'flex'},
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                }}
              >
                OtakuForums
              </Typography>
            </Box>
          </Link>

          <IconButton onClick={changeTheme}>
            <Tooltip title='Toggle dark mode'>
              {
                darkMode 
                ? <DarkMode fontSize='large' /> 
                : <LightMode fontSize='large' htmlColor='white' />
              }
            </Tooltip>
          </IconButton>
          
          <Tooltip title='Open settings'>
            <IconButton onClick={handleOpenUserMenu} sx={{ color: 'inherit' }}>
              {user ? <AvatarIcon name={user.username} /> : <AccountCircle />} 
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {
              !user ? 
              userOptions.map((userOption) => (
                <Link key={userOption} to={`/${userOption}`} style={{ textDecoration: 'inherit', color: 'inherit'}}>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign='center'>{userOption}</Typography>
                  </MenuItem>
                </Link>
              )) :
              <MenuItem onClick={handleLogout} disabled={isLoading}>
                {
                  isLoading ? 
                  <CircularProgress color='inherit' /> :
                  <Typography textAlign='center'>Logout</Typography>
                }
              </MenuItem>
            }
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  )
}