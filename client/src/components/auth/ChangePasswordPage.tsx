import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeUserPassword, validatePassword } from '../../services/userService';
import { notify } from './../../utils/notificationUtils';


function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [message] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [messageType] = useState(''); // Track the type of message to display
  const navigate = useNavigate();

  const handlePasswordBlur = () => {
    const validation = validatePassword(newPassword);
    setNewPasswordError(validation.errorMessage);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmNewPassword(value);
    if (newPassword !== value) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if all fields are filled and no validation errors are present
    if (!oldPassword || !newPassword || !confirmNewPassword || newPasswordError || confirmPasswordError) {
      notify('Please ensure all fields are filled out correctly and that there are no errors.', 'error');
      return; // Stop the function if validation fails
    }

    // Ensure the new password and confirmation password match
    if (newPassword !== confirmNewPassword) {
      notify('The new password and confirmation do not match.', 'error');
      return;
    }

    try {
      const success = await changeUserPassword(oldPassword, newPassword);
      if (success !== undefined) {
        // There's already a message being set by notify, so we don't need to set it here
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      // const errorMessage = error instanceof Error ? error.message : 'Failed to change password.';
    }
  };



  return (
    <div className="flex flex-col items-center justify-center  bg-gray-100 px-4">
      <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-6 my-12">Change Your Password</h1>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password:</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="relative">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="off"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  onBlur={handlePasswordBlur}
                />


                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 cursor-pointer" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11 a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304 l-.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                  </svg>

                  {showTooltip || newPasswordError ? (
                    <div className="absolute z-10 right-0 mr-10 w-64 p-2 text-sm bg-white border border-gray-300 rounded-md shadow-lg">
                      <ul className="list-disc pl-5 space-y-1">
                        {newPasswordError ? (
                          newPasswordError.split('. ').map((error, index) => (
                            <li key={index} className="text-red-500">{error.trim().endsWith('.') ? error : `${error}...`}</li>
                          ))
                        ) : (
                          <>
                            <li>Password must be at least 8 characters long.</li>
                            <li>Include at least one uppercase letter.</li>
                            <li>Include at least one lowercase letter.</li>
                            <li>Include at least one special character.</li>
                          </>
                        )}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="relative">
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password:</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={handleConfirmPasswordChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onBlur={() => { }}
              />
              {confirmPasswordError && (
                <div className="absolute right-0 mr-10 mt-1 w-64 p-2 text-sm text-red-500 bg-white border border-red-300 rounded-md shadow-lg">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{confirmPasswordError}</li>
                  </ul>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!oldPassword || !newPassword || !confirmNewPassword || !!newPasswordError || !!confirmPasswordError}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!oldPassword || !newPassword || !confirmNewPassword || !!newPasswordError || !!confirmPasswordError
                ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
            >
              Change Password
            </button>
          </form>
        </div>
        {message && (
          <div className={`mt-4 text-sm text-center ${messageType === 'error' ? 'text-red-600 bg-red-100 border-l-4 border-red-500' : 'text-green-600 bg-green-100 border-l-4 border-green-500'} p-4 rounded-md shadow-lg w-full max-w-md`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChangePasswordPage;

