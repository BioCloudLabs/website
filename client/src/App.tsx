import { useEffect, useState } from 'react';  
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // You can keep this if there are styles that you're not overriding with Tailwind
import Homepage from './components/common/Homepage';
import BlastPage from './components/common/BlastPage';
import DashboardPage from './components/common/DashboardPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import LogoutButton from './components/auth/LogoutButton';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ProfilePage from './components/profile/ProfilePage';
import CreditsOffersPage from './components/payment/CreditsOffersPage';
import SuccessPage from './components/payment/SuccessPage';
import CancelledPage from './components/payment/CancelledPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <nav className="flex justify-between items-center px-4 py-2 bg-blue-700 fixed w-full z-10">
          <div className="flex space-x-4">
            <Link to="/" className="text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            <Link to="/credits-offers" className="text-white px-3 py-2 rounded-md text-sm font-medium">Credits Offers</Link>
            {isAuthenticated && (
              <>
                <Link to="/profile" className="text-white px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                <Link to="/dashboard" className="text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                <Link to="/blast" className="text-white px-3 py-2 rounded-md text-sm font-medium">BLAST</Link>
              </>
            )}
          </div>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <LogoutButton onLogout={() => { localStorage.removeItem('token'); setIsAuthenticated(false); }} />
            ) : (
              <>
                <Link to="/login" className="text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/register" className="text-white px-3 py-2 rounded-md text-sm font-medium">Register</Link>
              </>
            )}
          </div>
        </nav>

        {/* Offset mt-16 to account for the fixed header size */}
        <div className="flex flex-grow mt-16">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/blast" element={<ProtectedRoute isAuthenticated={isAuthenticated}><BlastPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><DashboardPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProfilePage /></ProtectedRoute>} />
            <Route path="/credits-offers" element={<CreditsOffersPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancelled" element={<CancelledPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
