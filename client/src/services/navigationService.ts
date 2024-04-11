import { useNavigate, useLocation } from 'react-router-dom';

// A custom hook that abstracts away the navigation logic
export function useHomepageNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // This function encapsulates the conditional navigation logic
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
