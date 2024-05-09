import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserCredits, updateUserProfile, fetchUserProfile, getLocationOptions } from '../../services/userService';
import { User } from '../../models/User';
import { Location } from '../../models/Locations';
import { notify } from '../../utils/notificationUtils';


const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [credits, setCredits] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchUserProfile();
        const locationData = await getLocationOptions();
        const userCredits = await fetchUserCredits();
        // console.log("Credits fetched:", userCredits); // Log the fetched credits
        if (!userData) throw new Error('User not found');
        setUser(userData);
        setLocations(locationData);
        setCredits(userCredits);
      } catch (error) {
        setErrorMessage('Failed to fetch data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === 'password') {
      setPassword(value);
    } else if (name === 'credits') {
      setCredits(Number(value));
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
      await updateUserProfile(updateData);
      notify('Profile updated successfully!', "success");
      setTimeout(() => {
        setSuccessMessage('');
      }, 1500);
    } catch (error) {
      notify('Failed to update profile. Please try again.', "error");
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
    <div className="flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center pt-4 my-12">Edit Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" name="email" autoComplete="email" value={user?.email || ''} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none" />

            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input id="name" type="text" name="name" autoComplete='name' value={user?.name || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />

            <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname</label>
            <input id="surname" type="text" name="surname" autoComplete="surname" value={user?.surname || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />


            <label htmlFor="location_id" className="block text-sm font-medium text-gray-700">Location</label>
            <select id="location_id" name="location_id" value={user?.location_id || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              {locations.map(location => (
                <option key={location.id} value={location.id}>{location.display_name}</option>
              ))}
            </select>
            <label htmlFor="credits" className="block text-sm font-medium text-gray-700">Credits</label>
            <input
              id="credits"
              type="text"
              name="credits"
              value={credits !== null ? credits : ''}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
            <button type="submit" disabled={isUpdating} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:shadow-outline">
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => navigate('/change-password')}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Change Password
            </button>
          </form>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;
