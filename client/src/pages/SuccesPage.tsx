import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get('success');

  console.log('Success:', success); // Log the 'success' variable

  useEffect(() => {
    if (success === 'true') {
      console.log('Operation successful, redirecting in 3 seconds...'); // Log before redirecting
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      return () => clearTimeout(timer); // cleanup on unmount
    }
  }, [success]);

  return (
    <div>
      {success === 'true' ? (
        <div>
          <h1>Success!</h1>
          <p>Your operation was successful. Redirecting to homepage in 3 seconds...</p>
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

export default SuccessPage;