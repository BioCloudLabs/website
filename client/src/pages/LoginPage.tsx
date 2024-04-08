import React, { useState } from 'react';
import './../css/LoginPage.css';
import { loginUser } from './../services/userService'; // Adjust the import path as necessary

interface LoginPageProps {
  onLogin: () => void;
  onForgotPassword: () => void;
}

function LoginPage({ onLogin, onForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const loginResult = await loginUser(email, password);
    if (loginResult) {
      console.log('Login successful:', loginResult);
      onLogin(); // Assuming this triggers a re-render or redirection in your app
    } else {
      // Update the error message based on your userService or specific error handling
      setLoginError('Failed to log in. Please check your credentials and try again.');
    }
  };

  return (
    <div className="login-page-container">
      <h1 className="text-3xl font-bold mb-6">Log in</h1>
      <form onSubmit={handleSubmit} className="login-form">
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
      <button onClick={onForgotPassword} className="forgot-password-link">
        Forgot Password?
      </button>
      {loginError && <p className="login-error-message">{loginError}</p>}
    </div>
  );
}

export default LoginPage;
