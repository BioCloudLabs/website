import React, { useState } from 'react';
import './../css/LoginPage.css';

interface LoginPageProps {
  onLogin: () => void;
  onForgotPassword: () => void;
}

function LoginPage({ onLogin, onForgotPassword }: LoginPageProps & { onForgotPassword: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
        const response = await fetch('/user/login', { // Updated to match your Flask backend endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            setLoginError(errorData.message || 'Login failed. Please check your email and password.'); // Assuming your Flask app returns a message in case of error
            return;
        }

        const data = await response.json();
        console.log('Login successful:', data);

        // Save the token to LocalStorage
        localStorage.setItem('token', data.access_token); // Adjusted for your Flask backend response

        // Here, instead of fetching user data again (since it might not be needed right away),
        // you can directly invoke the onLogin callback to update the application state.
        onLogin();
    } catch (error) {
        console.error('Login error:', error);
        setLoginError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-page-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            requiredlogin-page-container
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

        {loginError && <p className="login-error-message">{loginError}</p>}

        <button type="submit" className="login-button">Log In</button>
      </form>
      <button onClick={onForgotPassword} className="forgot-password-link">
        Forgot Password?
      </button>
      {loginError && <p className="login-error-message">{loginError}</p>}
    </div>
  );
}

export default LoginPage;
