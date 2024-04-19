import React from 'react';

const LogoutButton: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const handleLogout = () => {
    // Perform logout actions here, e.g., clearing the authentication token
    localStorage.removeItem('token'); // Example: remove a token from local storage
    localStorage.removeItem('userProfile'); // Example: remove a user profile from local storage


    onLogout();
  };


  return( <button className="text-white px-3 py-2 rounded-md text-sm font-medium" onClick={handleLogout}>Logout</button>);
};

export default LogoutButton;
