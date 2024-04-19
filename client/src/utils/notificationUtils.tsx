import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Generic notify function to display toast notifications
export const notify = (message: string, duration: number = 3000) => {
  toast(message, {
    position: "top-center", // Change the position to bottom-center
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
