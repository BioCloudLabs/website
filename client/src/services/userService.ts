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
 * Registers a new user with the provided details.
 * @param userDetails - An object containing user details like email, password, name, etc.
 * @returns A Promise that resolves to a boolean indicating whether the registration was successful.
 */
export const registerUser = async (userDetails: {
  email: string,
  password: string,
  name: string,
  surname: string,
  location_id: number
}): Promise<boolean> => {
  try {
    const response = await fetch('/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed. Please try again.');
    }

    return true;
  } catch (error) {
    console.error('Registration error:', error);
    return false;
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

 * Note that I have two different functions for getting the user token and the user profile.
 * This is because the user token is used for authentication, while the user profile contains additional user information.
 * Also, their format is different, the token is not a JSON object, while the user profile is a JSON object.
 * 
*/

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
 * Retrieves a list of location options for user registration.
 * @returns A promise that resolves to an array of objects containing the location id and name.
 */
export const getLocationOptions = async (): Promise<{ id: number; name: string }[]> => {
  // Static data for example purposes
  return [
      { id: 1, name: "Spain" },
      { id: 2, name: "Portugal" }
  ];
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