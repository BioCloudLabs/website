import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, getLocationOptions, validatePassword } from '../../services/userService';
import { Location } from '../../models/Locations';
import { notify } from '../../utils/notificationUtils';

/**
 * Represents the registration page component.
 * Allows users to register by providing their email, password, name, surname, and location.
 * Performs validation on form fields and handles form submission.
 */
function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [location_id, setLocationId] = useState('');
    const [locations, setLocations] = useState<Location[]>([]);
    const [registrationError] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const locationData = await getLocationOptions();
                setLocations(locationData);
                if (locationData.length > 0) {
                    setLocationId(locationData[0].id.toString());
                }
            } catch (error) {
                console.error('Failed to fetch locations:', error);
                notify('Failed to fetch locations', 'error');
            }
        };
        fetchLocations();
    }, []);


    const handlePasswordBlur = () => {
        const { isValid, errorMessage } = validatePassword(password);
        setPasswordError(errorMessage);
        return isValid;
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const confirmPassValue = e.target.value;
        setConfirmPassword(confirmPassValue);

        // Validate confirm password
        if (password !== confirmPassValue) {
            setConfirmPasswordError('Password does not match.');
        } else {
            setConfirmPasswordError('');
        }
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevents the default form submission behavior

        // Additional check to prevent submission if any fields are incorrect or empty
        if (!email || !name || !surname || !location_id || !password || !confirmPassword || passwordError || confirmPasswordError) {
            notify('Please ensure all fields are filled out correctly and that there are no errors.', 'error');
            return; // Stop the function if validation fails
        }

        try {
            const success = await registerUser({ email, password, name, surname, location_id: parseInt(location_id) });
            if (success) {
                setTimeout(() => navigate('/login'), 3000); // Navigate after successful registration
            }
        } catch (error) {
            console.error('Failed to register user:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md">
                
                <h1 className="text-3xl font-bold text-center mb-6 my-12">Register</h1>
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <form autoComplete="off" onSubmit={handleSubmit} className="space-y-6">
                        <label htmlFor="hidden" className="hidden">Hidden Field</label>
                        <input autoComplete="false" id="hidden" name="hidden" type="text" className="hidden" />

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="off"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="off"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    aria-describedby={passwordError ? 'password-error-info' : undefined}
                                    onBlur={handlePasswordBlur}
                                />
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 cursor-pointer" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11 a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                                    </svg>
                                    {showTooltip || passwordError ? (
                                        <div className="absolute z-10 right-0 mr-10 w-64 p-2 text-sm bg-white border border-gray-300 rounded-md shadow-lg">
                                            <ul className="list-disc pl-5 space-y-1">
                                                {passwordError ? (
                                                    passwordError.split('. ').map((error, index) => (
                                                        <li key={index} className="text-red-500">{error.trim().endsWith('.') ? error : `${error}...`}</li>
                                                    ))
                                                ) : (
                                                    <>
                                                        <li>Password must be at least 8 characters long.</li>
                                                        <li>Include at least one uppercase letter.</li>
                                                        <li>Include at least one lowercase letter.</li>
                                                        <li>Include at least one special character.</li>
                                                    </>
                                                )}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                onBlur={() => { }}
                            />
                            {confirmPasswordError && (
                                <div className="absolute right-0 mr-10 mt-1 w-64 p-2 text-sm text-red-500 bg-white border border-red-300 rounded-md shadow-lg">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>{confirmPasswordError}</li>
                                    </ul>
                                </div>
                            )}
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
                        <div className="relative">
                            <label htmlFor="location_id" className="block text-sm font-medium text-gray-700">Location</label>
                            <div className="inline-block relative w-full">
                                <select
                                    id="location_id"
                                    name="location_id"
                                    value={location_id}
                                    onChange={(e) => setLocationId(e.target.value)}
                                    required
                                    className="block w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                                >
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.id}>{location.display_name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!email || !password || !confirmPassword || !name || !surname || !location_id || Boolean(passwordError) || Boolean(confirmPasswordError)}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!email || !password || !confirmPassword || !name || !surname || !location_id || passwordError || confirmPasswordError
                                ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' // Styles for disabled state
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' // Styles for enabled state
                                }`}>
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
