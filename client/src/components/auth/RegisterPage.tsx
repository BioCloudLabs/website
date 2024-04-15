import React, { useState, useEffect } from 'react';
import { registerUser, getLocationOptions } from './../../services/userService';
import { Location } from '../../models/Locations';
import './../../css/RegisterPage.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [location_id, setLocationId] = useState<string>('1'); // Initialize with '1' or an empty string if no default
  const [locations, setLocations] = useState<Location[]>([]); // Use Location[] type here
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      const locationData = await getLocationOptions();
      setLocations(locationData);
      setLocationId(locationData[0].id.toString()); // Set default to first location's ID
    };

    fetchLocations();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const registrationResult = await registerUser({
      email, password, name, surname, location_id: parseInt(location_id)
    });

    if (registrationResult) {
      setRegistrationSuccess(true);
      setEmail('');
      setPassword('');
      setName('');
      setSurname('');
      setLocationId('1'); // Reset to default or maintain consistency
    } else {
      setRegistrationError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-6">Register</h1>
      {registrationSuccess ? (
        <p className="bg-green-100 text-green-800 p-3 rounded-md text-center">Registration successful! You can now log in.</p>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input type="email" id="email" name="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input type="password" id="password" name="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
            <input type="text" id="name" name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="mb-4">
            <label htmlFor="surname" className="block text-gray-700 text-sm font-bold mb-2">Surname:</label>
            <input type="text" id="surname" name="surname" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={surname} onChange={(e) => setSurname(e.target.value)} required />
          </div>

          <div className="mb-4">
            <label htmlFor="location_id" className="block text-gray-700 text-sm font-bold mb-2">Location:</label>
            <select id="location_id" name="location_id" className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" value={location_id} onChange={(e) => setLocationId(e.target.value)} required>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {registrationError && <p className="text-red-500 text-xs italic">{registrationError}</p>}

          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Register</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default RegisterPage;