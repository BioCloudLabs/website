import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUser, getLocations } from './../services/userService';
import { User } from './../models/User'; // Ensure the import path is correct

interface Location {
  id: number;
  name: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const fetchedUser = await getCurrentUser();
        const fetchedLocations = await getLocations();
        setUser(fetchedUser); // fetchedUser is already typed, no need for null check here if your service handles it
        setLocations(fetchedLocations ?? []); // Use ?? to fallback to an empty array if null/undefined
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setErrorMessage('Failed to fetch initial data.');
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (user) {
      const updatedUser: Partial<User> = { ...user, [name]: value };
      setUser(updatedUser as User); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        const updatedUser = await updateUser(user);
        if (updatedUser) {
          alert('Profile updated successfully!');
        } else {
          setErrorMessage('Failed to update profile.');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        setErrorMessage('Failed to update profile. Please try again later.');
      }
    }
  };

  if (!user) return <div>No user data found. Please log in.</div>; // Update the message as appropriate

  return (
    <div>
      <h2>Edit Profile</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={user.email} onChange={handleInputChange} required />
        </div>
        {}
        <select name="location_id" value={user.location_id.toString()} onChange={handleInputChange}>
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default ProfilePage;
