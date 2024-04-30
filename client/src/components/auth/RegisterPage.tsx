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
    const [showTooltip, setShowTooltip] = useState(false);


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
                        <div className="relative">
    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
    <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        aria-describedby="password-info"
    />
    <div className="absolute right-0 top-0 mt-8 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 cursor-pointer" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
        </svg>
    </div>
    <div id="password-info" className="absolute z-10 w-64 p-2 text-sm text-gray-100 bg-gray-900 rounded-md shadow-lg" style={{ display: showTooltip ? 'block' : 'none', right: '0', top: '2.5rem' }}>
        Password must be at least 8 characters including 1 uppercase, 1 lowercase, and 1 special character.
    </div>
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
