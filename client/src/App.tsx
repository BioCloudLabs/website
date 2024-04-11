import { useEffect, useState } from 'react';
import './App.css';
import Homepage from './pages/Homepage';
import BlastPage from './pages/BlastPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LogoutButton from './components/LogoutButton';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import CreditsOffersPage from './pages/CreditsOffersPage';
import SuccessPage from './pages/SuccesPage';
import CancelledPage from './pages/CancelledPage';


import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Update isAuthenticated when the app mounts or localStorage changes
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Assuming you're storing the token in localStorage
    setIsAuthenticated(false);
  };

  const handleForgotPassword = () => {
    console.log("Forgot password handler invoked");
  };
  

  return (
    <Router>
      <div className="App">
        <nav className="navigation">
          <div className="nav-left">
            <Link to="/">Home</Link>
            <Link to="/blast">BLAST</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/creditsOffers">Credits Offers</Link>
            {isAuthenticated && <Link to="/profile">Profile</Link>}
          </div>
          <div className="nav-right">
            {isAuthenticated ? (
              <LogoutButton onLogout={handleLogout} />
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/blast" element={<BlastPage />} />
          <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} onForgotPassword={handleForgotPassword} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate replace to="/login" />} />
          <Route path="/creditsOffers" element={<CreditsOffersPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancelled" element={<CancelledPage />} />
          {/* Redirects or private routes can be handled with conditional rendering */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
