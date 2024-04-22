import React from 'react';
import { logoutUser } from '../../services/userService'; // Import the logoutUser function

const LogoutButton: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the logoutUser function to handle logout
      onLogout(); // Invoke the callback function provided by the parent component
    } catch (error) {
      console.error('Logout error:', error);
      // Handle any logout errors here, such as displaying an error message to the user
    }
  };

  return (
    <button className="text-white px-3 py-2 rounded-md text-sm font-medium" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
