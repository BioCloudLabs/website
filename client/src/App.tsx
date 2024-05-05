import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Homepage from './components/common/Homepage';
import JobRequest from './components/blast/JobRequest';
import DashboardPage from './components/common/DashboardPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ProfilePage from './components/profile/ProfilePage';
import CreditsOffersPage from './components/payment/CreditsOffersPage';
import SuccessPage from './components/payment/SuccessPage';
import CancelledPage from './components/payment/CancelledPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ChangePasswordPage from './components/auth/ChangePasswordPage';
import AuthGuard from './components/auth/AuthGuard';
import { ToastContainer, notify } from './utils/notificationUtils';
import { invalidateToken, logoutUserLocally } from './services/userService';
import RecoverPasswordPage from './components/auth/RecoverPassword';
import { fetchUserCredits } from './services/userService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedAuthStatus = !!localStorage.getItem('token');
      setIsAuthenticated(updatedAuthStatus);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const message = sessionStorage.getItem('postLogoutMessage');
    if (message) {
      notify(message, 'error');
      sessionStorage.removeItem('postLogoutMessage');
    }
  }, []);

  // New useEffect for handling credits update
  useEffect(() => {
    const handleCreditsUpdate = async () => {
      if (isAuthenticated) {
        const updatedCredits = await fetchUserCredits();
        setUserCredits(updatedCredits);
      } else {
        setUserCredits(null);
      }
    };

    handleCreditsUpdate();

    // Subscribe to storage event
    window.addEventListener('storage', handleCreditsUpdate);

    return () => {
      window.removeEventListener('storage', handleCreditsUpdate);
    };
  }, [isAuthenticated, location]); // Now this effect depends on both authentication status and location
  

  const handleLogout = async () => {
    let isTokenInvalid = false; // Flag to check if the token is invalid

    try {
      // Attempt to invalidate the server-side session first
      await invalidateToken();  
    } catch (error) {
      console.error('Logout error:', error);
      notify('Logout failed. Please try again.', 'error');
      isTokenInvalid = true;  //  Set the flag to true if the token is invalid
    }

    // Clear local storage
    logoutUserLocally();

    if (isTokenInvalid) {
      sessionStorage.setItem('postLogoutMessage', 'Session expired or token invalid. Please log in again.');
      window.location.href = '/login';  // Redirect to login page
    } else {
      window.location.href = '/';  // Redirect to home page
    }
  };

  return (
    <Router>
      <div className="flex flex-col bg-gray-100 min-h-screen">
        <nav className="flex justify-between items-center px-4 py-2 bg-blue-700 w-full z-10">
          <div className="flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white mr-4 inline-flex lg:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <div className={`lg:flex flex-grow items-center ${isOpen ? 'flex' : 'hidden'}`}>
              <Link to="/" className="text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/credits-offers" className="text-white px-3 py-2 rounded-md text-sm font-medium">Credits Offers</Link>
              {isAuthenticated && (
                <>
                  <Link to="/profile" className="text-white px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                  <Link to="/dashboard" className="text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                  <Link to="/blast" className="text-white px-3 py-2 rounded-md text-sm font-medium">Request VM</Link>
                </>
              )}
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            {isAuthenticated ? (
              <>
                <Link to="/credits-offers" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:underline">
                  Credits: {userCredits}
                </Link>
                <button onClick={handleLogout} className="text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/register" className="text-white px-3 py-2 rounded-md text-sm font-medium">Register</Link>
              </>
            )}
          </div>
        </nav>

        <div className="flex-grow pt-8">
          <Routes>
          <Route path="/" element={<><Homepage /></>} /> {/* This is the default route, it will render Homepage component when the path is correct */}
            <Route path="/blast" element={<ProtectedRoute isAuthenticated={isAuthenticated}><JobRequest /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><DashboardPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/change-password" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ChangePasswordPage /></ProtectedRoute>} />
            <Route path="/recoverpassword" element={<RecoverPasswordPage />} />
            <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
            <Route path="/credits-offers" element={<CreditsOffersPage />} />
            <Route path="/success" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SuccessPage/> </ProtectedRoute>} />
            <Route path="/cancelled" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CancelledPage/> </ProtectedRoute>} />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
