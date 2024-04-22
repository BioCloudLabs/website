import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/userService';
import { LoginPageProps } from '../../models/LoginProps';

function LoginPage({ onLoginSuccess, setIsAuthenticated }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const loginResult = await loginUser(email, password);
            if (loginResult) {
                setIsAuthenticated(true);
                onLoginSuccess();
                navigate('/dashboard');
            } else {
                setLoginError('Failed to log in. Please check your credentials and try again.');
            }
        } catch (error: unknown) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                setLoginError(error.message);
            } else {
                setLoginError('Login failed due to an unexpected error.');
            }
        }
    };

    const handleForgotPasswordClick = () => {
        navigate('/forgot-password');
    };

    return (
    <div className="flex flex-col items-center justify-center h-auto bg-gray-100 px-10">
        <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center my-4">Log in</h1>
                <div className="bg-white p-2 rounded-lg shadow-md">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete='email'
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete='current-password'
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Log In
                        </button>
                        <div className="text-center">
                            <button onClick={handleForgotPasswordClick} className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                </div>
                {loginError && (
                    <div className="mt-4 text-sm text-center text-red-600 bg-red-100 border-l-4 border-red-500 p-4 rounded-md shadow-lg w-full max-w-md">
                        {loginError}
                    </div>
                )}
            </div>
        </div>
    );
    
    
    
}

export default LoginPage;
