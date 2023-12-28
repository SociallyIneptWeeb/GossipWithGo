import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Error({ message } : { message: string }) {
  return (
    <Box
      sx={{
        marginTop: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" marginBottom={3}>
        Sorry, an unexpected error has occurred.
      </Typography>
      <Typography variant="subtitle1">
        {message}
      </Typography>
    </Box>
  )
}
