// src/components/LogoutButton.tsx

import React from 'react';

const LogoutButton: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const handleLogout = () => {
    // Perform logout actions here, e.g., clearing the authentication token
    localStorage.removeItem('authToken'); // Example: remove a token from local storage

    // Call the onLogout passed down from the parent component to update the isAuthenticated state
    onLogout();
  };

  return( <button onClick={handleLogout}>Logout</button>);
};
    
export default LogoutButton;
