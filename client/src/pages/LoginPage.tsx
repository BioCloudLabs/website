import React, { useState } from 'react';
import './../css/LoginPage.css';

interface LoginPageProps {
  onLogin: () => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
        const response = await fetch('https://reqres.in/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            setLoginError(errorData.error || 'Login failed. Please check your email and password.');
            return;
        }

        const data = await response.json();
        console.log('Login successful:', data);

        // Save the token to LocalStorage
        localStorage.setItem('token', data.token);

        // Fetch user information using the token
        const userResponse = await fetch('https://reqres.in/api/users?page=2', {
            headers: {
                'Authorization': `Bearer ${data.token}`,
            },
        });

        if (!userResponse.ok) {
            console.error('Failed to fetch user information');
            return;
        }

        const userData = await userResponse.json();
        console.log('User information:', userData);

        // Save user information to LocalStorage
        localStorage.setItem('user', JSON.stringify(userData.data[0]));

        // Call the callback to update the current page
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

        {loginError && <p className="login-error-message">{loginError}</p>}

        <button type="submit" className="login-button">Log In</button>
      </form>
    </div>
  );
}

export default LoginPage;
