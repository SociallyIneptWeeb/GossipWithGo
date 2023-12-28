import { Snackbar, Alert, SnackbarCloseReason } from "@mui/material"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import useToast from "./hooks/UseToast"


export const Toast = (): JSX.Element => {
  const toast = useSelector((state: RootState) => state.toast)
  const { clearToast } = useToast()
  const handleClose = (_: unknown, reason?: SnackbarCloseReason) =>
    reason !== "clickaway" && clearToast()
  
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={toast.timeout}
      onClose={handleClose}
    >
      <Alert
        variant='filled'
        onClose={handleClose}
        severity={toast.type}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  )
}