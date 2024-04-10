import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './../css/CancelledPage.css'; // import the CSS file

const CancelledPage: React.FC = () => {
  console.log('Rendering CancelledPage'); // Log when the component renders

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const cancelled = queryParams.get('canceled');

  console.log('Cancelled:', cancelled); // Log the 'cancelled' variable

  useEffect(() => {
    if (cancelled === 'true') {
      const timer = setTimeout(() => {
        console.log('Navigating to /test'); // Log before navigating
        navigate('/test'); // Try navigating to a different route
      }, 3000);
      return () => clearTimeout(timer); // cleanup on unmount
    }
  }, [cancelled, navigate]);

  return (
    <div className={cancelled === 'true' ? 'cancelled-container' : 'homepage-container'}>
      {cancelled === 'true' ? (
        <div>
          <h1>Operation Cancelled</h1>
          <p>Your operation was cancelled. Redirecting to homepage in 3 seconds...</p>
        </div>
      ) : (
        <div>
          <h1>Oops!</h1>
          <p>It looks like you've reached this page by mistake.</p>
        </div>
      )}
    </div>
  );
};

export default CancelledPage;