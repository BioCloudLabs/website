import { toast, ToastContainer, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Displays a notification with configurable auto-close timing.
 * 
 * @param message The message to be displayed in the notification.
 * @param type The type of notification ('error', 'success', etc.).
 * @param timeout Duration in milliseconds before the notification auto-closes. 
 *                If not provided, defaults to 5000 milliseconds.
 */
export const notify = (message: string, type: 'info' | 'success' | 'error' | 'warning' | 'default' = 'default', timeout: number = 2000) => {
  const options = {
    position: "top-center" as ToastPosition,
    autoClose: timeout,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    progress: undefined,
  };

  switch (type) {
    case 'error':
      toast.error(message, options);
      break;
    case 'success':
      toast.success(message, options);
      break;
    case 'info':
      toast.info(message, options);
      break;
    case 'warning':
      toast.warn(message, options);
      break;
    default:
      toast(message, options); // Default toast with no type specified
      break;
  }
};

// Exporting ToastContainer to be used at the top level of the application
export { ToastContainer };
