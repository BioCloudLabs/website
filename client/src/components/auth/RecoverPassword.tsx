import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { recoverPassword, validatePassword } from './../../services/userService'; // Ensure path correctness
import { notify } from './../../utils/notificationUtils';

function RecoverPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [message, setMessage] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setMessage('No token provided. Please use the link provided in your reset email.');
            navigate('/login'); // Redirect if no token is present
        }
    }, [token, navigate]);

    

    const handlePasswordBlur = () => {
        const validation = validatePassword(newPassword);
        setPasswordError(validation.errorMessage);
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPass = e.target.value;
        setNewPassword(newPass);
        const validation = validatePassword(newPass);
        setNewPasswordError(validation.errorMessage);
    };
    
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (newPassword !== value) {
            setConfirmPasswordError('Passwords do not match.');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!newPassword || !confirmPassword || passwordError || confirmPasswordError) {
            notify('Please ensure all fields are filled out correctly and that there are no errors.', 'error');
            return;
        }

        try {
            await recoverPassword(newPassword, token as string);  // Type assertion since token is checked for null
            notify('Your password has been successfully reset.', 'success');
            setTimeout(() => navigate('/login'), 5000); // Redirect after successful reset
        } catch (error: any) {  // Type 'any' to safely access error properties
            const errorMessage = error instanceof Error ? error.message : 'Failed to change password.';
            notify(errorMessage, 'error');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">Reset Your Password</h1>
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    onBlur={handlePasswordBlur}
                                />
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 cursor-pointer" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11 a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l-.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                                    </svg>
                                    {showTooltip || passwordError ? (
                                        <div className="absolute z-10 right-0 mr-10 w-64 p-2 text-sm bg-white border border-gray-300 rounded-md shadow-lg">
                                            <ul className="list-disc pl-5 space-y-1">
                                                {passwordError ? (
                                                    passwordError.split('. ').map((error, index) => (
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
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
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
                            disabled={
                                !newPassword ||
                                !confirmPassword ||
                                newPasswordError.length > 0 ||
                                confirmPasswordError.length > 0
                            }
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!newPassword ||
                                    !confirmPassword ||
                                    newPasswordError.length > 0 ||
                                    confirmPasswordError.length > 0
                                    ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' // Styles for disabled state
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' // Styles for enabled state
                                }`}
                        >
                            Reset Password
                        </button>

                    </form>
                </div>
                {message && (
                    <div className={`mt-4 text-sm text-center ${message.includes('successfully') ? 'text-green-600 bg-green-100 border-l-4 border-green-500' : 'text-red-600 bg-red-100 border-l-4 border-red-500'} p-4 rounded-md shadow-lg w-full max-w-md`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecoverPasswordPage;
