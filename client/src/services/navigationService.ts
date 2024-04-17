import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook for handling authenticated navigation.
 * @returns {Function} - A function to handle navigation if authenticated.
 */
export function useAuthenticatedNavigation() {
  const navigate = useNavigate();

  // This function encapsulates the navigation logic for authenticated routes
  function navigateIfAuthenticated(targetRoute: string) {
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(targetRoute);
    }
  }

  return navigateIfAuthenticated;
}

/**
 * Custom hook for handling navigation logic on the homepage.
 * @returns {Function} - The handleNavigation function.
 */
export function useHomepageNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Encapsulates the conditional navigation logic based on the URL search parameters.
   */
  function handleNavigation() {
    const searchParams = new URLSearchParams(location.search);
    const isSuccess = searchParams.get('success') === 'true';
    const isCancelled = searchParams.get('canceled') === 'true';

    if (isSuccess) {
      navigate('/success');
    } else if (isCancelled) {
      navigate('/cancelled');
    }
    // Removed the else clause to prevent the loop
  }

  return handleNavigation;
}