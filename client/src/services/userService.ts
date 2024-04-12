import { User } from './../models/User'; // Adjust the import path as necessary
import { LoginResponse } from './../models/LoginResponse'; // Adjust the import path as necessary

/**
 * Logs in a user with the provided email and password.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @returns A Promise that resolves to a LoginResponse object if the login is successful, or null if there is an error.
 */
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

    // Store the token and user profile in localStorage
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userProfile', JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

/**
 * Retrieves the current user from the local storage.
 * @returns A Promise that resolves to the current user object, or null if no user profile is found in the local storage.
 */
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

/**
 * Retrieves the current user token from the local storage.
 * @returns A Promise that resolves to the current user object, or null if no user profile is found in the local storage.
 */
export const getCurrentUserToken = async (): Promise<User | null> => {
  try {
    const userProfileString = localStorage.getItem('token');
    if (!userProfileString) {
      return null; // No user profile found in localStorage
    }
    const userProfile = JSON.parse(userProfileString);
    return userProfile as User;
  } catch (error) {
    console.error('Error fetching user token from localStorage:', error);
    return null;
  }
};


/**
 * Updates the user profile.
 * @param user - The user data to be updated.
 * @returns A Promise that resolves to the updated user object or null if the update fails.
 */
export const updateUser = async (user: User): Promise<User | null> => {
  try {
    const response = await fetch('/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Ensure the token is sent correctly
      },
      body: JSON.stringify({
        name: user.name,
        surname: user.surname,
        password: user.password,  // Ensure this is included if needed or remove if not
        location_id: user.location_id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
};


/**
 * Retrieves the locations based on the user's location_id.
 *
 * This is a placeholder for actual logic that would be used with a /locations endpoint.
 * 
 * @returns A promise that resolves to an array of objects containing the location id and name.
 */
export const getLocations = async (): Promise<{ id: number; name: string }[]> => {

  // Simulated locations data
  const simulatedLocations = [
    { id: 1, name: "Headquarters" },
    { id: 2, name: "Remote Office" },

  ];

  // Attempt to get the current user's location_id from localStorage
  const currentUserProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const userLocationId = currentUserProfile.location_id;

  // Find the location that matches the user's location_id
  const userLocation = simulatedLocations.find(location => location.id === userLocationId);

  // Return an array with only the user's location or an empty array if not found
  return userLocation ? [userLocation] : [];
};


/**
 * Removes the login authentication from the localStorage.
 * 
 * This function will also need token destruction logic that would be used with a /logout endpoint.
 *
 */
export const logoutUser = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userProfile');
};

/**
 * Sends a request to the server to reset the user's password.
 *
 * @param email - The email address of the user to reset the password for.
 * @returns A promise that resolves to a boolean indicating success or failure.
 */
export const forgotPassword = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch('/user/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send password reset link');
    }

    return true; // Successfully sent password reset link
  } catch (error) {
    console.error('Forgot password error:', error);
    return false; // Failed to send password reset link
  }
};
