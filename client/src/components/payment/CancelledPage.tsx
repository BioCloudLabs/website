import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../css/CancelledPage.css';

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
    <div className='cancelled-container'>
      <h1>Operation Cancelled</h1>
      <p>Your operation was cancelled. Redirecting to homepage in {countdown} seconds...</p>
    </div>
  );
};

export default CancelledPage;