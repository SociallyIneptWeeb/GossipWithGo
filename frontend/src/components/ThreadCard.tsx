import { Badge, Box, Card, CardContent, Typography } from '@mui/material'
import CategoryIcon from '../components/CategoryIcon'
import { Comment } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { TimeFromNow } from '../helpers'
import { Thread, UserData } from '../redux/types'

interface Props {
  thread: Thread
  user: UserData
}

export default function ThreadCard({thread, user}: Props) {
  return (
    <Link to={`thread/${thread.id}`} style={{ textDecoration: 'inherit', color: 'inherit'}}>
      <Card sx={{ boxShadow: 3, ':hover': { boxShadow: 15, cursor: 'pointer' }}}>
        <CardContent>
          <Box display='flex' flexDirection='row'>
            <Typography fontWeight='bold' mr='auto' gutterBottom noWrap>
              {thread.title}
            </Typography>
            <Badge badgeContent={thread.comments?.length} color='primary' />
              <Comment sx={{marginRight: 1}} /> 
            <Badge />
            <CategoryIcon name={thread.category.name} />
          </Box>
          <Typography variant='body2' noWrap marginTop={1}>
            {thread.description}
          </Typography>
          <Typography color='text.secondary' textAlign='right' fontSize={14} marginTop={1}>
            {thread.creator.id === user.id ? 'You' : thread.creator.username} {TimeFromNow(thread.created_at)} 
          </Typography>
        </CardContent>
      </Card>
    </Link>
  )
}