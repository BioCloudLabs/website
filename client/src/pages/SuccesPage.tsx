import React from 'react';
import { useLocation } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get('success');

  return (
    <div>
      {success === 'true' ? (
        <div>
          <h1>Success!</h1>
          <p>Your operation was successful.</p>
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
