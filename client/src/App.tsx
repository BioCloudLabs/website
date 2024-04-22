import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
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
import ChangePasswordPage from './components/auth/ChangePasswordPage';
import { ToastContainer } from './utils/notificationUtils';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false); // State to manage the navbar toggle
  const [isClicked, setIsClicked] = useState(false); // State to track click status

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // Fetch user credits from localStorage when the user logs in
    if (isAuthenticated) {
      const credits = localStorage.getItem('userCredits');
      setUserCredits(credits ? parseInt(credits, 10) : null);
    } else {
      setUserCredits(null);
    }
  }, [isAuthenticated]);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 1000);
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
                  <Link to="/blast" className="text-white px-3 py-2 rounded-md text-sm font-medium">BLAST</Link>
                </>
              )}
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/credits-offers"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:underline`}
                  onClick={handleClick}
                >
                  <span className={`text-${isClicked ? 'white' : 'blue-400'} hover:text-white transition-colors duration-300`}>
                    Credits: {userCredits}
                  </span>
                </Link>
                <LogoutButton onLogout={() => { localStorage.removeItem('token'); setIsAuthenticated(false); }} />
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
            <Route path="/" element={<Homepage />} />
            <Route path="/blast" element={<ProtectedRoute isAuthenticated={isAuthenticated}><BlastPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><DashboardPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/change-password" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ChangePasswordPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProfilePage /></ProtectedRoute>} />
            <Route path="/credits-offers" element={<CreditsOffersPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancelled" element={<CancelledPage />} />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
