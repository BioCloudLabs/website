// Assuming User.tsx is correctly placed and has the User interface
import { User } from './../models/User'; // Update the import path as necessary

export interface LoginResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}

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

    const data = await response.json(); // Adjusted to not explicitly type as LoginResponse for clarity in this fix

    // Assuming data contains access_token and user details directly
    localStorage.setItem('token', data.access_token);
    // Exclude the access_token when saving the userProfile
    const { access_token, ...userProfile } = data;
    localStorage.setItem('userProfile', JSON.stringify(userProfile));

    return data as LoginResponse; // Casting it back to LoginResponse for the return type
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};


export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userProfile = localStorage.getItem('userProfile');
    console.log(userProfile); // Check the actual retrieved value
    if (!userProfile) {
      return null; // No user profile found in localStorage
    }
    return JSON.parse(userProfile);
  } catch (error) {
    console.error('Error fetching user profile from localStorage:', error);
    return null;
  }
};


export const updateUser = async (userData: Omit<User, 'password' | 'created_at' | 'updated_at'>): Promise<User | null> => {
  try {
    const response = await fetch('/user/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user data.');
    }

    const updatedUser: User = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Error updating user data:', error);
    return null;
  }
};

export const getLocations = async () => {
  try {
    const response = await fetch('/locations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Authorization header might be needed based on your API's requirements
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locations.');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error; // Or handle this more gracefully
  }
};
