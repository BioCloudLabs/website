import { User } from './../models/User'; // Adjust the import path as necessary
import { LoginResponse } from './../models/LoginResponse'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

/****************** USER UTILITY SERVICES SECTION START ******************/


export const redirectToLogin = () => {
  const navigate = useNavigate();
  navigate('/login');
}

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 401 && errorData.msg.includes("Token has expired")) {
      // Logout the user, remove the token, and redirect to login
      logoutUser();  // This will clear the token and user info
      redirectToLogin();  // Redirect user to the login page
      throw new Error("Session has expired. Please log in again.");
    }
    throw new Error(errorData.msg || 'There was a problem processing your request.');
  }
  return response.json();  // Return the response JSON if no errors
}

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
 * User Retrieval Explanation:
 * 
 * Note that I have two different functions for getting the user token and the user profile.
 * This is because the user token is used for authentication, while the user profile contains additional user information.
 * Also, their format is different, the token is not a JSON object, while the user profile is a JSON object.
 * 
*/

/**
 * Retrieves the current user token from the local storage.
 * @returns A Promise that resolves to the current user object, or null if no user profile is found in the local storage.
 */
export const getCurrentUserToken = (): string | null => {
  return localStorage.getItem('token');
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


/****************** USER UTILITY SERVICES SECTION END ******************/

/****************** API CALLS SECTION START ******************/


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
 * Updates the user profile.
 * @param user - The user data to be updated.
 * @returns A Promise that resolves to the updated user object or null if the update fails.
 */
export const updateUser = async (user: User): Promise<User | null> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const response = await fetch('/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: user.name,
        surname: user.surname,
        password: user.password,  // Ensure this is included if needed or remove if not
        location_id: user.location_id,
      }),
    });

    const data = await handleApiResponse(response);  // Use the handleApiResponse function
    return data;
  } catch (error: any) {
    console.error('Error updating user profile:', error.message);
    return null;
  }
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
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // If required
      },
      body: JSON.stringify({ email }),
    });

    await handleApiResponse(response);  // Handle potential token expiration
    return true; // Successfully sent password reset link
  } catch (error: any) {
    console.error('Forgot password error:', error.message);
    return false; // Failed to send password reset link
  }
};


/****************** API CALLS SECTION END ******************/
