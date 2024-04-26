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

  if (isTokenInvalid) {
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
 * Registers a new user with the provided details.
 * @param userDetails - An object containing user details like email, password, name, etc.
 * @returns A Promise that resolves to a boolean indicating whether the registration was successful.
 * If registration fails, throws an error with the backend message.
 */
export const registerUser = async (userDetails: RegistrationForm): Promise<boolean> => {
  try {
    const response = await fetch('/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDetails),
    });

    const data = await response.json(); // Parse JSON regardless of the response status

    if (!response.ok) {
      // Check if there are detailed field errors to be displayed
      if (data.errors && data.errors.json) {
        const fieldErrors = Object.entries(data.errors.json).map(([key, val]) => `${key}: ${(val as string[]).join(', ')}`).join('\n');
        throw new Error(fieldErrors || 'Registration failed. Please try again.');
      }
      throw new Error(data.message || 'Registration failed. Please try again.');
    }

    return true; // Indicate success
  } catch (error: any) {
    console.error('Registration error:', error.message);
    throw new Error(error.message); // Re-throwing to be handled by the calling component
  }
};


/****************** REGISTER SECTION END ******************/

/****************** LOGIN SECTION START ******************/

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

      // Store the token in localStorage
      localStorage.setItem('token', data.access_token);

      // Fetch user credits and profile
      const credits = await fetchUserCredits();
      const userProfile = await fetchUserProfile();

      if (credits !== null && userProfile !== null) {
        // Store the user credits and profile in localStorage
        localStorage.setItem('userCredits', credits.toString());
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
      } else {
        console.error('Failed to fetch user credits or profile');
      }

      // Redirect to home or wherever you need to go after login
      // You can use React Router's history object to navigate programmatically

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw the error with the message from the server
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

    if (!response.ok) {
      isTokenValid(); // Check if the token is valid before proceeding
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    // Uncomment the lines below to log the response data

    // const responseData = await response.json();
    // console.log('Profile update response:', responseData); // Log the response for debugging

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

export const fetchUserCredits = async (): Promise<number | null> => {
  

  try {
    const response = await fetch('/user/credits', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user credits');
    }

    if (!response.ok && response.status === 401) { // Using 401 is unauthorized due to invalid token

      await logoutUser(true); // Log out the user if token is invalid
    }

    const data = await response.json();
    return data.credits;
  } catch (error) {
    console.error('Error fetching user credits:', error);
    throw error;
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
export const changeUserPassword = async (oldPassword: string, newPassword: string) => {
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
          notify(errorData.message || 'Failed to change password.', 'error');
          return Promise.reject(new Error(errorData.message || 'Failed to change password.'));
      }

      const data = await response.json();
      notify(data.message, 'success');
      return Promise.resolve();
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
      notify(errorData.message || 'Failed to send recovery email.', 'error');
      return Promise.reject(new Error(errorData.message || 'Failed to send recovery email.'));
    }

    // const data = await response.json();
    notify(`Email has been sent to ${email}`, 'success');
  } catch (error) {
    console.error('Error sending recovery email:', error);
    notify('An error occurred while sending the recovery email. Please try again.', 'error');
    throw error;
  }
};

/**
 * Validates the recovery password token received via email.
 * @param token The token received from the URL.
 * @returns A promise that resolves to a boolean indicating whether the token is valid.
 */
export const validateRecoveryToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`/user/validate-recover-token?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token validation error:', errorData.message);
      return false;
    }

    const data = await response.json();
    return data.isValid;
  } catch (error) {
    console.error('Error validating recovery token:', error);
    return false;
  }
};



/**
 * Resets the password of the user using a token received in the recovery email.
 * @param newPassword The new password that the user wants to set.
 * @param token The token that the user received in the recovery email.
 * @returns A promise that resolves when the password has been reset.
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
      notify(errorData.message || 'Failed to reset password.', 'error');
      return Promise.reject(new Error(errorData.message || 'Failed to reset password.'));
    }

    const data = await response.json();
    notify(data.message, 'success');
  } catch (error) {
    console.error('Error resetting password:', error);
    notify('An error occurred while resetting your password. Please try again.', 'error');
    throw error;
  }
};

/****************** FORGOT PASSWORD SECTION END ******************/

