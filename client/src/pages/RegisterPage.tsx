import React, { useState } from 'react';
import './../css/RegisterPage.css'; // Ensure the path is correct and you have the corresponding CSS

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [locationId, setLocationId] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          surname, 
          location_id: parseInt(locationId, 10) || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setRegistrationError(errorData.message || 'Registration failed. Please try again.');
        return;
      }

      setRegistrationSuccess(true);
      // Optionally reset form fields here
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="register-page-container">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      {registrationSuccess ? (
        <p className="registration-success-message">Registration successful! You can now log in.</p>
      ) : (
        <form onSubmit={handleSubmit} className="register-form">
          {/* Email input */}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Password input */}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Name input */}
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {/* Surname input */}
          <label htmlFor="surname">Surname:</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
          {/* Location ID input */}
          <label htmlFor="locationId">Location ID:</label>
          <input
            type="number"
            id="locationId"
            name="locationId"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          />

          {registrationError && <p className="registration-error-message">{registrationError}</p>}

          <button type="submit" className="register-button">Register</button>
        </form>
      )}
    </div>
  );
}

export default RegisterPage;
