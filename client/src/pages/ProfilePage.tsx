import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUser } from './../services/userService';
import { User } from './../models/User';
import './../css/ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulated locations for the select dropdown
  const locations = [
    { id: 1, name: 'Spain' },
    { id: 2, name: 'Portugal' },
    // Add more locations as necessary
  ];

  // Simulated roles for the display
  const roles = [
    { id: 1, name: 'registered' },
    { id: 2, name: 'staff' },
    { id: 3, name: 'admin' },
    // Add more roles as necessary
  ];
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (!userData) throw new Error('User not found');
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setErrorMessage('Failed to fetch user data. Please refresh the page.');
      }
    };

    fetchUser();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value,
    } as User));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    try {
      const updatedUser = await updateUser(user);
      if (!updatedUser) throw new Error('Failed to update user');
      alert('Profile updated successfully!');
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  const userRoleName = roles.find(role => role.id === user.role_id)?.name || 'Unknown Role';


  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="profile-form">
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} required className="profile-input" />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={user.name} onChange={handleChange} required className="profile-input" />
        </div>
        <div>
          <label>Surname:</label>
          <input type="text" name="surname" value={user.surname} onChange={handleChange} required className="profile-input" />
        </div>
        <div>
          <label>Credits:</label>
          <span>{user.credits} <a href="/creditsOffers">Add More Credits</a></span>
        </div>
        <div>
          <label>Location:</label>
          <select name="location_id" value={user.location_id} onChange={handleChange} required className="profile-input">
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
        </div>
        {/* Implement change password button functionality */}
        <button onClick={() => alert('Change password functionality not implemented yet')}>Change Password</button>
        <button type="submit" disabled={isUpdating}>Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;
