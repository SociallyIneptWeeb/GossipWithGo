import { useDispatch } from "react-redux"
import { ToastActions } from "../../redux/toastSlice"
import { ToastState } from "../../redux/types"

export default function useToast() {
  const dispatch = useDispatch()
  
  const displayToast = (toast: ToastState) => {
    dispatch(ToastActions.clearToast())
    dispatch(ToastActions.addToast(toast))
  }
  
  const clearToast = () => {
    dispatch(ToastActions.clearToast())
  }
  
  return { displayToast, clearToast }
}