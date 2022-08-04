import { toast } from 'react-toastify';

export const ToastWrapper = (msg, type, options) => {
  return toast(msg, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type: type || 'info',
    ...options,
  });
};
