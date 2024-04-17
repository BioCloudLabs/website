// LoginPage.tsx

import React, { useState, useEffect } from 'react';
import './../../css/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { loginUser} from '../../services/userService';
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
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Login failed due to an error.');
        }
    };

    const handleForgotPasswordClick = () => {
        navigate('/forgot-password'); // Navigate to forgot password page
    };

    return (
        <div className="login-page-container">
            <h1 className="text-3xl font-bold mb-6">Log in</h1>
            <form onSubmit={handleLogin} className="login-form">
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Log In</button>
            </form>
            <button onClick={handleForgotPasswordClick} className="forgot-password-link">
                Forgot Password?
            </button>
            {loginError && <p className="login-error-message">{loginError}</p>}
        </div>
    );
}

export default LoginPage;