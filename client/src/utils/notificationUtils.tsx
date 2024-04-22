import { toast, ToastContainer, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Common toast options that will be used for all types of toasts
const commonOptions = {
  position: 'top-center' as ToastPosition,
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored", // Use "colored" for vibrant styles
};

// Custom toast styles for different types
const toastTypeStyles = {
  info: 'bg-purple-600 text-white',
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-yellow-600 text-white',
  default: 'bg-blue-600 text-white',
};

// Generic notify function to display toast notifications with different styles
export const notify = (message: string, type: 'info' | 'success' | 'error' | 'warning' | 'default' = 'default') => {
  const options = {
    ...commonOptions,
    className: `${toastTypeStyles[type]} rounded-lg px-6 py-4 shadow-lg max-w-md mx-auto`
  };
  switch (type) {
    case 'info':
      toast.info(message, options);
      break;
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warning':
      toast.warn(message, options);
      break;
    default:
      toast(message, options); // Default case for generic messages without specific styling
      break;
  }
};

// Exporting ToastContainer to be used at the top level of the application
export { ToastContainer };
