import { User } from './../models/User'; 
import { LoginResponse } from './../models/LoginResponse'; 

/****************** TOKEN SERVICES SECTION START ******************/

/**
 * BACKEND ENDPOINT TO DO:
 * 
 * This function requires a backend endpoint to validate the token.
 * @returns 
 */
export const isTokenValid = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  
  try {
    const response = await fetch('/validate-token', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating token:', error);
    throw error; // Re-throw the error with the message from the server
  }
};


// Add check for token expiration with a cookie to request if the token is valid

export const handleApiResponse = async (response: Response, navigate: (path: string) => void) => {
  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 401 && errorData.msg.includes("Token has expired")) {
      redirectToLogin(navigate);  // Pass the navigate function
      throw new Error("Session has expired. Please log in again.");
    }
    throw new Error(errorData.msg || 'There was a problem processing your request.');
  }
  return response.json();
};


/****************** TOKEN SERVICES SECTION END ******************/

/****************** USER UTILITY SERVICES SECTION START ******************/


export const redirectToLogin = (navigate: (path: string) => void) => {
  logoutUser();  // This will clear the token and user info
  navigate('/login');  // Use the passed navigate function
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

    // Store the token and user profile in localStorage // Adjust to use cookies
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userProfile', JSON.stringify(data));

    // Send to /validate-token

    // Send to home

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Re-throw the error with the message from the server
  }
};


/**
 * Registers a new user with the provided details.
 * @param userDetails - An object containing user details like email, password, name, etc.
 * @returns A Promise that resolves to a boolean indicating whether the registration was successful.
 * If registration fails, throws an error with the backend message.
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
  } catch (error: any) {
    console.error('Registration error:', error.message);
    throw error; // Re-throw the error with the message from the server
  }
};



/**
 * Updates the user profile.
 * @param user - The user data to be updated.
 * @param navigate - Function to navigate to another route (pass from React component using useNavigate).
 * @returns A Promise that resolves to the updated user object or null if the update fails.
 */
export const updateUser = async (user: User, navigate: (path: string) => void): Promise<User | null> => {
  try {
    // First check if the token is valid
    const isValidToken = await isTokenValid();
    if (!isValidToken) {
      // If token is not valid, navigate to login
      redirectToLogin(navigate);
      throw new Error('Authentication token is invalid or expired. Redirecting to login.');
    }

    // Proceed with updating the user profile if the token is valid
    const token = localStorage.getItem('token');
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

    const data = await handleApiResponse(response, navigate);  // Use the handleApiResponse function
    return data;
  } catch (error: any) {
    console.error('Error updating user profile:', error.message);
    throw error; // Re-throw the error with the message from the server
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
    throw error; // Re-throw the error with the message from the server
  }
};

/****************** API CALLS SECTION END ******************/
