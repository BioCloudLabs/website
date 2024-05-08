import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendRecoverPasswordEmail } from './../../services/userService'; // Ensure this import path matches the location of your userService

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendRecoverPasswordEmail(email);
      setMessage('If your account exists, a reset link is on its way. Please check your email inbox.');
    } catch (error) {
      setError('Failed to send reset instructions. Please try again.'); // It's critical to handle errors explicitly
      console.error('Error sending password reset email:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md my-4">
      <h1 className="text-3xl font-bold text-center my-12 mb-6">Forgot Password</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {loading ? 'Sending...' : 'Send Reset Instructions'}
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

export default ForgotPasswordPage;
