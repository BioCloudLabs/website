import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateUser, logoutUser, getLocationOptions } from '../../services/userService';
import { User } from '../../models/User'; 
import { Location } from '../../models/Locations';



const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndLocations = async () => {
      try {
        const userData = await getCurrentUser();
        const locationData = await getLocationOptions();
        if (!userData) throw new Error('User not found');
        setUser(userData);
        setLocations(locationData);
      } catch (error) {
        setErrorMessage('Failed to fetch data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndLocations();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === 'password') {
      setPassword(value);
    } else {
      setUser(prevUser => ({
        ...prevUser,
        [name]: value,
      } as User));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    const updateData = {
      ...user,
      password: password.trim() // Only include password if it's been changed
    };

    setIsUpdating(true);
    try {
      const updatedUser = await updateUser(updateData, navigate);
      if (!updatedUser) throw new Error('Failed to update user');
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        logoutUser();
        navigate('/login'); // Redirect to login after logout
      }, 1500); // Delay to display message before logging out
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <h1 className="text-lg font-semibold">Loading...</h1>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <label className="block">
          <span className="text-gray-700">Email</span>
          <input type="email" name="email" value={user?.email || ''} onChange={handleChange}
                 required className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none" readOnly />
        </label>
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input type="text" name="name" value={user?.name || ''} onChange={handleChange}
                 required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </label>
        <label className="block">
          <span className="text-gray-700">Surname</span>
          <input type="text" name="surname" value={user?.surname || ''} onChange={handleChange}
                 required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </label>
        <label className="block">
          <span className="text-gray-700">Location</span>
          <select name="location_id" value={user?.location_id || ''} onChange={handleChange}
                  required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.display_name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-gray-700">Password</span>
          <input type="password" name="password" value={password} onChange={handleChange}
                 className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </label>
        <button type="submit" disabled={isUpdating} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;
