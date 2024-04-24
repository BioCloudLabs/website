import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, getLocationOptions } from '../../services/userService';
import { Location } from '../../models/Locations';
import { notify } from '../../utils/notificationUtils';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [location_id, setLocationId] = useState('');
    const [locations, setLocations] = useState<Location[]>([]);
    const [registrationError, setRegistrationError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocations = async () => {
            try { // Fetch locations and set the default location once the component mounts
                const locationData = await getLocationOptions();
                setLocations(locationData);
                if (locationData.length > 0) {
                    setLocationId(locationData[10].id.toString()); // Set default location as West Europe
                }
            } catch (error) {
                console.error('Failed to fetch locations:', error);
                notify('Failed to fetch locations', 'error');
            }
        };
        fetchLocations();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setRegistrationError('');  // Clear previous errors
        try {
            const response = await registerUser({
                email, password, name, surname, location_id: parseInt(location_id)
            });

            if (response) {
                notify('Registration successful! Redirecting to login page.', 'success');
                // Notify the user that the registration was successful
                setTimeout(() => navigate('/login'), 3000); // Redirect to login after a delay
            }
        } catch (error: any) {
            setRegistrationError(error.message || 'Registration failed. Please try again.');
            // For errors, its better to keep the message static
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname</label>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="location_id" className="block text-sm font-medium text-gray-700">Location</label>
                            <select
                                id="location_id"
                                name="location_id"
                                value={location_id}
                                onChange={(e) => setLocationId(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {locations.map((location) => (
                                    <option key={location.id} value={location.id}>{location.display_name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Register
                        </button>
                    </form>
                </div>
                {registrationError && (
                    <div className="mt-4 text-sm text-center text-red-600 bg-red-100 border-l-4 border-red-500 p-4 rounded-md shadow-lg w-full max-w-md">
                        {registrationError}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RegisterPage;
