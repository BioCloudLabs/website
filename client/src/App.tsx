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
        <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 right-0 z-20">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2.5 lg:py-3">
              <a href="/" className="flex items-center space-x-3">
                <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">BioCloudLabs</span>
              </a>
              <div className="flex items-center">
                {/* Collapsible Section */}
                <div className={`items-center justify-between w-full md:hidden ${isOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
                  <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    <li>
                      <Link to="/" className="block py-2 px-3 text-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-blue-500" onClick={() => setIsOpen(false)}>Home</Link>
                    </li>
                    <li>
                      <Link to="/credits-offers" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-blue-700 md:p-0 dark:text-white" onClick={() => setIsOpen(false)}>Credits Offers</Link>
                    </li>
                    {isAuthenticated && (
                      <>
                        <li>
                          <Link to="/profile" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-blue-700 md:p-0 dark:text-white" onClick={() => setIsOpen(false)}>Profile</Link>
                        </li>
                        <li>
                          <Link to="/dashboard" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-blue-700 md:p-0 dark:text-white" onClick={() => setIsOpen(false)}>Dashboard</Link>
                        </li>
                        <li>
                          <Link to="/blast" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:text-blue-700 md:p-0 dark:text-white" onClick={() => setIsOpen(false)}>Request VM</Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 rounded-lg md:hidden ml-auto" // Modified class: ml-auto
                  aria-label="Toggle navigation"
                  aria-expanded={isOpen}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>

                {/* User Controls */}
                <div className="flex items-center space-x-4 ml-4">
                  {isAuthenticated ? (
                    <>
                      <span className="text-white px-3 py-2 rounded-md">Credits: {userCredits}</span>
                      <button onClick={handleLogout} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-3 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</Link>
                      <Link to="/register" className="text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-3 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register</Link>
                    </>
                  )}
                  <button type="button" className="text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-3 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get Started</button>
                </div>
              </div>
            </div>
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
            <Route path="/success" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SuccessPage /> </ProtectedRoute>} />
            <Route path="/cancelled" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CancelledPage /> </ProtectedRoute>} />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
