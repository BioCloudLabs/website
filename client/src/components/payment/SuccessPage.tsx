import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  const [countdown, setCountdown] = useState(3); // Initialize countdown state with 3
  const navigate = useNavigate();

  useEffect(() => {
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
    <div className='bg-green-200 text-green-800 text-center p-6 rounded-lg max-w-lg mx-auto mt-16 shadow-md'>
      <h1 className='text-3xl font-bold mb-4'>Success!</h1>
      <p className='text-lg'>Your operation was successful. Redirecting to homepage in {countdown} seconds...</p>
    </div>
  );
};

export default SuccessPage;
