import { Navigate } from 'react-router-dom';
import { RouteProps } from 'react-router-dom'; // Import RouteProps for typing

interface ProtectedRouteProps extends Omit<RouteProps, 'element'> {
  element: React.ReactElement; // Define the element prop to pass the component to render
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check authentication

  // Use Navigate for redirection in v6
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
