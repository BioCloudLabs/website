// src/components/LogoutButton.tsx

import React from 'react';

const LogoutButton: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const handleLogout = () => {
    // Perform logout actions here, e.g., clearing the authentication token
    localStorage.removeItem('token'); // Example: remove a token from local storage
    localStorage.removeItem('userProfile'); // Example: remove a user profile from local storage


    onLogout();
  };

  return( <button onClick={handleLogout}>Logout</button>);
};

export default LogoutButton;
