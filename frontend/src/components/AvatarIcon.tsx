import { Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  const splitName = name.split(' ');
  const initials = splitName.length > 1 ? `${splitName[0][0]}${splitName[1][0]}`.toUpperCase() : `${splitName[0][0]}`.toUpperCase()

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: <Typography color='white'>{initials}</Typography>,
  };
}

interface Props {
  name: string
}

export default function AvatarIcon({ name }: Props) {
  return <Avatar {...stringAvatar(name)} />
}
