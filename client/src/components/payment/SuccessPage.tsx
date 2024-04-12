import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './../../css/SuccessPage.css';

const SuccessPage: React.FC = () => {
  const [countdown, setCountdown] = useState(3); // Initialize countdown state with 3
  const navigate = useNavigate();

  useEffect(() => {
    // console.log('Operation successful, redirecting in 3 seconds...');
    
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
    <div className='success-container '>
      <h1>Success!</h1>
      <p>Your operation was successful. Redirecting to homepage in {countdown} seconds...</p>
    </div>
  );
};

export default SuccessPage;
