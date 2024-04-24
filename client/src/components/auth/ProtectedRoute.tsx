import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }: { isAuthenticated: boolean, children: React.ReactNode }) => {
  return isAuthenticated ? children : <Navigate replace to="/login" />;
};

export default ProtectedRoute;