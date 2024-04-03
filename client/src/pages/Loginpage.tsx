import React, { useState } from 'react';
import './../css/LoginPage.css'; // Ensure this path matches your project structure

function LoginPage() {
  // State hooks for managing form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Mock function to simulate form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the form from actually submitting
    console.log(`Login attempt with username: ${username} and password: ${password}`);

    // Here you can replace the console.log with your future login logic
    // For example, sending a fetch request to your backend when it's ready
  };

  return (
    <div className="login-page-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
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
    </div>
  );
}

export default LoginPage;
