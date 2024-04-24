import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeUserPassword } from '../../services/userService';

function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [message, setMessage] = useState('');
const navigate = useNavigate();

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
        await changeUserPassword(oldPassword, newPassword);
        setMessage('Password changed successfully. Please log in with your new password.');
        navigate('/login');
    } catch (error) {
        setMessage((error as Error).message || 'Failed to change password.');
    }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Change Password</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password:</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Change Password
            </button>
          </form>
          {message && (
            <div className="text-sm text-green-600 bg-green-100 border-l-4 border-green-500 p-4 rounded-md shadow-lg mt-4 w-full max-w-md text-center">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
