import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Represents the CancelledPage component.
 * This component displays a message indicating that the operation was cancelled and redirects to the homepage after a countdown.
 */
const CancelledPage: React.FC = () => {
  const [countdown, setCountdown] = useState(3); // Initialize countdown state with 3
  const navigate = useNavigate();

  useEffect(() => {
    // // console.log('Operation cancelled, redirecting in 3 seconds...');
    
    // Update the countdown every second
    const interval = setInterval(() => {
      setCountdown((currentCountdown) => currentCountdown - 1);
    }, 1000);
    
    // Redirect when countdown reaches 0
    const timer = setTimeout(() => {
      navigate('/'); // Use navigate('/') to navigate to homepage
    }, 3000);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className='bg-red-200 text-red-800 text-center p-6 rounded-lg max-w-lg mx-auto mt-16 shadow-md'>
      <h1 className='text-3xl font-bold mb-4'>Operation Cancelled</h1>
      <p className='text-lg'>Your operation was cancelled. Redirecting to homepage in {countdown} seconds...</p>
    </div>
  );
};

export default CancelledPage;
