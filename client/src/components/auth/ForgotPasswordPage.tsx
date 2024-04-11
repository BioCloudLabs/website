import React, { useState } from 'react';
import './../../css/ ForgotPasswordPage.css';


function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Password reset request for:', email);
    // Mock backend email search and response
    setMessage('If your account exists, a reset link is on its way. Please check your email inbox.');
  };

  return (
    <div className="forgot-password-page-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Send Reset Instructions</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ForgotPasswordPage;
