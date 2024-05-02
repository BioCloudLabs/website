import { User } from './../models/User';
import { LoginResponse } from './../models/LoginResponse';
import { RegistrationForm } from '../models/RegistrationForm';
import { Location } from '../models/Locations';
import { notify } from './../utils/notificationUtils';


/****************** USER UTILITY SERVICES SECTION START ******************/

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


/****************** USER UTILITY SERVICES SECTION END ******************/

/****************** TOKEN SERVICES SECTION START ******************/

/**
 * Validates the authentication token by querying the backend endpoint.
 * Automatically logs out the user if the token is invalid, with a delay to allow the user to see the notification.
 * Uses Toastify to notify users directly about the token validation status.
 * Handles various error scenarios gracefully, including network issues and invalid tokens.
 *
 * @returns {Promise<boolean>} True if the token is valid, otherwise false.
 */
export const isTokenValid = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('/user/validate-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      notify(errorData.message || 'Session expired or invalid. Please log in again.', 'error');
      logoutUser(true);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    notify('A network or server error occurred. Please check your connection and try again.', 'error');
    logoutUser()
    return false;
  }
};

/****************** TOKEN SERVICES SECTION END ******************/

/****************** LOGOUT SECTION START ******************/

/**
 * Sends a POST request to the /users/logout endpoint to log out the user.
 * @returns A Promise that resolves when the logout is successful.
 */
export const invalidateToken = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch('/user/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Logout failed');
  }
};

/**
 * Logs out the user by making a call to the server to invalidate the token
 * and then handling local storage and redirection based on whether the logout
 * was due to an invalid token.
 * @param isTokenInvalid Optional parameter to specify if the token was invalid, triggering a forced logout.
 */
export const logoutUser = async (isTokenInvalid = false): Promise<void> => {
  try {
    await invalidateToken();  // Attempt to invalidate server-side session first
  } catch (error) {
    console.error('Logout error:', error); // Log any error that occurs during the logout process
    notify('Logout failed. Please try again.', 'error');
  }

  logoutUserLocally(); // Then clear local storage

  if (isTokenInvalid) { // If at this point the token was found invalid, redirect to login page
    sessionStorage.setItem('postLogoutMessage', 'Session expired or token invalid. Please log in again.');
    window.location.href = '/login';  // Redirect to login page
  } else {
    window.location.href = '/';  // Redirect to home page
  }
};

/**
/**
 * Logs out the user locally by clearing the local storage. 
 * This function is called after the server has confirmed the token invalidation.
 */
export const logoutUserLocally = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userProfile');
  localStorage.removeItem('userCredits');
};

/****************** LOGOUT SECTION END ******************/



/****************** REGISTER SECTION START ******************/

/**
 * Attempts to register a new user with the provided user details.
 * @param userDetails An object containing the user's registration information.
 * @returns A promise that resolves to true if registration is successful, or throws an error if not.
 */
export const registerUser = async (userDetails: RegistrationForm): Promise<boolean> => {
  try {
    const response = await fetch('/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDetails),
    });

    const data = await response.json() as { errors?: { json?: Record<string, string[]> }, message?: string };

    if (!response.ok) {
      if (response.status === 422 && data.errors && data.errors.json) {
        const fieldErrors = Object.entries(data.errors.json)
          .map(([field, errors]) => `${capitalizeFirstLetter(field)}: ${errors.join(', ')}.`)
          .join(' ');
        notify(fieldErrors || 'Invalid input data provided.', 'error', 7000);
        throw new Error(fieldErrors);
      } else if (response.status === 409) {
        notify(data.message || "Username already exists.", 'error', 7000);
        throw new Error(data.message || "Username already exists.");
      } else {
        notify(data.message || 'Registration failed. Please try again.', 'error', 7000);
        throw new Error(data.message || 'Registration failed. Please try again.');
      }
    }
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
 * Validates a password based on certain criteria.
 * @param password - The password to be validated.
 * @returns An object containing the validation result and error message.
 */
export const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  let errorMessage = '';
  if (!minLength) errorMessage += 'Password must be at least 8 characters long. ';
  if (!hasUpper) errorMessage += 'Include at least one uppercase letter. ';
  if (!hasLower) errorMessage += 'Include at least one lowercase letter. ';
  if (!hasSpecial) errorMessage += 'Include at least one special character. ';

  return {
    isValid: minLength && hasUpper && hasLower && hasSpecial,
    errorMessage
  };
};


/****************** REGISTER SECTION END ******************/

/****************** LOGIN SECTION START ******************/

/**
 * Logs in a user with the provided email and password.
 * 
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A promise that resolves to a `LoginResponse` object if the login is successful, or `null` otherwise.
 * @throws An error if the login fails.
 */
export const loginUser = async (email: string, password: string): Promise<LoginResponse | null> => {
  try {
    // Make a POST request to the server with the user's email and password
    const response = await fetch('/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // Check if the response was successful
    if (!response.ok) {
      // Parse the error response from the server
      const errorData = await response.json();

      // Specific handling for password and username errors
      if (response.status === 422 && errorData.errors?.json?.password?.includes('Password is not strong enough.')) {
        throw new Error('Invalid credentials. Please try again.'); // More specific for password strength issue
      } else if (response.status === 401 && errorData.message === 'Invalid credentials.') {
        throw new Error('Invalid username. Please try again.'); // Handling invalid credentials
      }

      // Default to server-provided message or a generic error if not detailed
      throw new Error(errorData.message || 'Login failed. Please try again.');
    }

    // Parse the successful response and store the access token locally
    const data: LoginResponse = await response.json();
    localStorage.setItem('token', data.access_token);

    // Successful login, return data
    return data;
  } catch (error) {
    // Log the error to the console and rethrow to handle it appropriately elsewhere
    console.error('Login error:', error);
    throw error;
  }
};





/****************** LOGIN SECTION END ******************/



/****************** PROFILE SECTION START ******************/


/**
 * Fetches the current user profile from the server using the /profile endpoint.
 * Ensures token is valid before making the request.
 * Throws an error if the token is invalid or if the profile fetch fails.
 * @returns A Promise that resolves to the user object if successful.
 */
export const fetchUserProfile = async (): Promise<User | null> => {
  const url = '/user/profile';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If the profile request fails, check if it's due to an invalid token
      const tokenStillValid = await isTokenValid();
      if (!tokenStillValid) {
        // If token is not valid, the function isTokenValid() will handle logout
        return null;
      }

      const errorData = await response.json();
      console.error('Failed to fetch profile:', errorData);
      throw new Error(`Failed to fetch user profile with status: ${response.status}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching user profile:', error.message);
      throw new Error(`Error fetching user profile: ${error.message}`);
    } else {
      console.error('An unexpected error occurred:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};




/**
 * Updates the current user profile on the server.
 * @param user - The user data to update.
 * @returns A Promise that resolves if the update is successful.
 */
export const updateUserProfile = async (user: User): Promise<void> => {
  const { name, surname, location_id } = user;

  try {
    const response = await fetch('/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, surname, location_id }),
    });

    // Uncomment the lines below to log the response data

    const responseData = await response.json();
    console.error('Profile update response:', responseData); // Log the response for debugging

  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};


/**
 * Fetches location options from the server and transforms them into the format required by the frontend.
 * @returns A Promise that resolves to an array of location objects containing id and display_name.
 */
export const getLocationOptions = async (): Promise<{ id: number; display_name: string, name: string }[]> => {

  try {
    const response = await fetch('/azuredata/locations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const data = await response.json();
    return data.locations.map((location: Location) => ({
      display_name: location.display_name,
      id: location.id,
      name: location.name,
    }));
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};




/****************** PROFILE SECTION END ******************/


/****************** USER CREDITS SECTION START ******************/

/**
 * Fetches the user's credits from the server using the /user/credits endpoint.
 * Ensures token is valid before making the request.
 * Throws an error if the token is invalid or if the credits fetch fails.
 * @returns A Promise that resolves to the user's credits if successful.
 */
export const fetchUserCredits = async (): Promise<number | null> => {
  const url = '/user/credits';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const tokenStillValid = await isTokenValid();
      if (!tokenStillValid) {
        // If token is not valid, the function isTokenValid() will handle logout
        return null;
      }

      const errorData = await response.json();
      console.error('Failed to fetch user credits:', errorData);
      throw new Error(`Failed to fetch user credits with status: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem('userCredits', data.credits.toString());
    return data.credits;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching user credits:', error.message);
      throw new Error(`Error fetching user credits: ${error.message}`);
    } else {
      console.error('An unexpected error occurred:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};




/****************** USER CREDITS SECTION END ******************/



/****************** CHANGE PASSWORD SECTION START ******************/

/**
 * Changes the user's password.
 * @param {string} oldPassword - The current password of the user.
 * @param {string} newPassword - The new password to be set.
 * @returns {Promise<void>} - A promise that resolves when the password is changed successfully.
 */
export const changeUserPassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
  const token = localStorage.getItem('token');
  if (!token) {
    notify('You are not logged in. Please log in to change your password.', 'error');
    return Promise.reject(new Error('No authentication token found.'));
  }

  try {
    const response = await fetch('/user/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    });

    if (!response.ok) {
      const errorData = await response.json();
      switch (response.status) {
        case 401:
          notify(errorData.message || 'Invalid credentials.', 'error');
          break;
        case 422:
          // Assume errorData.errors is an object with string keys and array of strings as values
          const errors = Object.entries(errorData.errors || {})
            .map(([field, errs]) => `${field}: ${(errs as string[]).join(', ')}`)
            .join('. ');
          notify(errors || 'Invalid input data provided.', 'error');
          break;
        default:
          notify(errorData.message || 'Failed to change password.', 'error');
      }
      return Promise.reject(new Error(errorData.message || 'Failed to change password.'));
    }

    const data = await response.json();
    notify(data.message, 'success');
    return Promise.resolve(true);  // Indicating success to the caller
  } catch (error) {
    console.error('Error changing password:', error);
    notify('An error occurred while changing your password. Please try again.', 'error');
    return Promise.reject(error);
  }
};



/****************** CHANGE PASSWORD SECTION END ******************/

/****************** FORGOT PASSWORD SECTION START ******************/

/**
 * Sends a recovery password email to the user's email address.
 * @param email The email address of the user to send the recovery email.
 * @returns A promise that resolves when the email has been sent.
 */
export const sendRecoverPasswordEmail = async (email: string): Promise<void> => {
  try {
    const response = await fetch('/user/recover-password-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send recovery email.');
    }

    notify(`Email has been sent to ${email}. Check your inbox for further instructions.`, 'success');
  } catch (error: unknown) {
    console.error('Error sending recovery email:', error);
    if (error instanceof Error) {
      notify(error.message || 'An error occurred while sending the recovery email. Please try again.', 'error');
    } else {
      notify('An error occurred while sending the recovery email. Please try again.', 'error');
    }
    throw error;
  }
};



/**
 * Recovers the user's password by sending a request to the server with a new password and a token.
 * If the request is successful, the user's password is reset.
 * If the request fails, specific errors are handled based on the backend response.
 *
 * @param newPassword - The new password to set for the user.
 * @param token - The token used for authentication and authorization.
 * @returns A promise that resolves with void when the password recovery is complete.
 * @throws An error if the password recovery fails or if specific errors occur during the process.
 */
export const recoverPassword = async (newPassword: string, token: string): Promise<void> => {
  try {
    const response = await fetch('/user/recover-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword })
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Handling more specific errors based on backend response
      switch (errorData.code) {
        case 409: // Specific error when new password is the same as the old one
          const message409 = errorData.message || "New password is the same as the old one.";
          notify(message409, 'error', 5000);
          throw new Error(message409); // Throw to exit and handle in the catch block without notifying again
        case 401: // Token expiry could also be handled here
          const message401 = 'The token has expired. Please request a new password reset.';
          notify(message401, 'error', 5000);
          throw new Error(message401); // Throw to exit and handle in the catch block without notifying again
        case 422: // Token expiry could also be handled here
          const message422 = 'The token has expired. Please request a new password reset.';
          notify(message422, 'error', 5000);
          throw new Error(message422); // Throw to exit and handle in the catch block without notifying again
        default:
          // Generic error handling
          throw new Error(errorData.message || 'Failed to reset password. Please try again.');
      }
    }

    const data = await response.json();
    notify(data.message || 'Your password has been successfully reset.', 'success');
  } catch (error: unknown) {
    console.error('Error resetting password:', error);
    if (!(error instanceof Error && (error.message === "New password is the same as the old one." || error.message === "The token has expired. Please request a new password reset."))) {
      // Only notify if not already handled specifically
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while resetting your password. Please try again.';
      notify(errorMessage, 'error');
    }
    throw error; // Re-throw to allow further handling if necessary
  }
};


/****************** FORGOT PASSWORD SECTION END ******************/

