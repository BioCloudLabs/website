import { User } from './../models/User'; // Adjust the import path as necessary
import { LoginResponse } from './../models/LoginResponse'; // Adjust the import path as necessary

export const loginUser = async (email: string, password: string): Promise<LoginResponse | null> => {
  try {
    const response = await fetch('/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data: LoginResponse = await response.json();

    // Assuming data contains access_token and user details directly
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userProfile', JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userProfileString = localStorage.getItem('userProfile');
    if (!userProfileString) {
      return null; // No user profile found in localStorage
    }
    const userProfile = JSON.parse(userProfileString);
    return userProfile as User;
  } catch (error) {
    console.error('Error fetching user profile from localStorage:', error);
    return null;
  }
};

  // Placeholder implementation API endpoint is pending
export const updateUser = async (userData: Omit<User, 'password' | 'created_at' | 'updated_at'>): Promise<User | null> => {

  console.log(userData); // To avoid the unused variable warning
  return null; // Temporarily return null to resolve the error
};


// Adjusting getLocations to work with the static location_id from userProfile in localStorage
export const getLocations = async (): Promise<{ id: number; name: string }[]> => {
  // This function now pretends to fetch location data based on the location_id
  // from the login response stored in localStorage. 
  // This is a placeholder for actual logic that would be used with a /locations endpoint.

  // Simulated locations data
  const simulatedLocations = [
    { id: 1, name: "Headquarters" },
    { id: 2, name: "Remote Office" },
    // Add more as needed
  ];

  // Attempt to get the current user's location_id from localStorage
  const currentUserProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const userLocationId = currentUserProfile.location_id;

  // Find the location that matches the user's location_id
  const userLocation = simulatedLocations.find(location => location.id === userLocationId);

  // Return an array with only the user's location or an empty array if not found
  return userLocation ? [userLocation] : [];
};
