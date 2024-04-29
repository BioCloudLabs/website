import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { recoverPassword } from './../../services/userService'; // Make sure the path is correct

function RecoverPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('No token provided. Please use the link provided in your reset email.');
        }
    }, [token]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!token) {
            setError('No token provided. Please use the link provided in your reset email.');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await recoverPassword(newPassword, token);
            setMessage('Your password has been successfully reset.');
            setTimeout(() => navigate('/login'), 5000); // Redirect only after successful reset
        } catch (error) {
            // Error handling should now be able to catch all rejections from recoverPassword
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred. Please try again.');
            }
            setLoading(false); // Stop the loading state on error
            return; // Stop execution to prevent redirection
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Reset Your Password</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go Back to Login
                    </button>
                </div>
                {message && (
                    <div className="text-sm text-green-600 bg-green-100 border-l-4 border-green-500 p-4 rounded-md shadow-lg mt-4 w-full max-w-md text-center">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="text-sm text-red-600 bg-red-100 border-l-4 border-red-500 p-4 rounded-md shadow-lg mt-4 w-full max-w-md text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecoverPasswordPage;
