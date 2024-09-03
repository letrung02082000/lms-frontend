import { toast } from 'react-toastify'

const toastWrapper = (msg, type, options) => {
  return toast(msg, {
    position: 'top-right',
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type: type || 'info',
    ...options
  })
}

export default toastWrapper
