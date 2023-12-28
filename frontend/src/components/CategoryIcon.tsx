import { Help, Info, SportsMma } from "@mui/icons-material";
import { SvgIconOwnProps } from "@mui/material";

interface Props {
  name: string
  props?: SvgIconOwnProps
}

export default function CategoryIcon({name, props} : Props) {
  return (
    name === 'Fight me' ? <SportsMma {...props} color='error' /> :
    name === 'Just curious' ? <Help {...props} color='secondary' /> :
    <Info {...props} color='primary' />
  )
}