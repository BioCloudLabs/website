import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Homepage from './components/common/Homepage';
import JobRequest from './components/blast/JobRequest';
import VMStatus from './components/blast/VMStatus';
import DashboardPage from './components/common/DashboardPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import AboutUsPage from './components/common/AboutUsPage';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
        <nav className="bg-blue-500  bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200  border-gray-600">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="/images/Brand/Brand_hero.webp" className="h-8" alt="BioCloudLabs Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap  text-white overflow-hidden text-ellipsis">BioCloudLabs</span>
            </a>
            <div className="flex items-center space-x-3 md:space-x-0 rtl:space-x-reverse ml-auto mr-4">
              {isAuthenticated ? (
                <Link to="/credits-offers" className="flex items-center mr-4 text-blue-700 hover:text-blue-800  text-white md: hover:text-blue-500" onClick={() => setIsOpen(false)}>
                  {userCredits}
                  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" width="32" height="32" viewBox="0 0 256 256" aria-labelledby="coinTitle" role="img" className="filter w-8 h-8 ml-2">
                    <title id="coinTitle">Coin Icon</title>
                    <defs></defs>
                    <g style={{ stroke: "none", strokeWidth: 0, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "none", fillRule: "nonzero", opacity: 1 }} transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                      <circle cx="45" cy="45" r="45" style={{ stroke: "none", strokeWidth: 1, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "rgb(255,200,67)", fillRule: "nonzero", opacity: 1 }} transform="matrix(1 0 0 1 0 0)" />
                      <circle cx="45" cy="45" r="35" style={{ stroke: "none", strokeWidth: 1, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "rgb(211,135,0)", fillRule: "nonzero", opacity: 1 }} transform="matrix(1 0 0 1 0 0)" />
                      <path d="M 46.524 26.367 l 5.019 10.169 c 0.248 0.501 0.726 0.849 1.279 0.93 l 11.222 1.631 c 1.394 0.203 1.95 1.915 0.942 2.898 l -8.12 7.915 c -0.4 0.39 -0.583 0.953 -0.489 1.504 l 1.917 11.176 c 0.238 1.388 -1.219 2.447 -2.465 1.791 l -10.037 -5.277 c -0.495 -0.26 -1.086 -0.26 -1.581 0 l -10.037 5.277 c -1.247 0.655 -2.703 -0.403 -2.465 -1.791 l 1.917 -11.176 c 0.095 -0.551 -0.088 -1.114 -0.489 -1.504 l -8.12 -7.915 c -1.008 -0.983 -0.452 -2.696 0.942 -2.898 l 11.222 -1.631 c 0.553 -0.08 1.032 -0.428 1.279 -0.93 l 5.019 -10.169 C 44.1 25.104 45.9 25.104 46.524 26.367 z" style={{ stroke: "none", strokeWidth: 1, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "rgb(255,200,67)", fillRule: "nonzero", opacity: 1 }} transform="matrix(1 0 0 1 0 0)" strokeLinecap="round" />
                    </g>
                  </svg> {/* SVG Icon taken from */}

                </Link>

              ) : null}
              <button
                onClick={() => setIsOpen(!isOpen)}
                data-collapse-toggle="navbar-sticky"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200  text-black-400  hover:bg-gray-700  focus:ring-gray-600"
                aria-controls="navbar-sticky"
                aria-expanded={isOpen}>
                <span className="sr-only text-black bg-gray-100">
                  Open main menu
                </span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14" xmlns="http://www.w3.org/2000/svg">
                  <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h15M1 7h15M1 13h15" />
                </svg>
              </button>
            </div>
            {/* User Controls - Improved Styling and Positioning */}
            <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex items-center justify-between w-full lg:w-auto`}>
              <div className="flex items-center space-x-4">
                <ul className="flex flex-col lg:flex-row p-4 lg:p-0 font-medium space-y-4 lg:space-y-0 lg:space-x-8 bg-gray-50  bg-gray-900 lg:bg-transparent rounded-lg lg:rounded-none">                
                  {isAuthenticated ? (
                    <>
                      <li><Link to="/dashboard" className="text-blue-700 hover:text-blue-800  text-white md: hover:text-blue-500" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
                      <li><Link to="/launch-vm" className="text-blue-700 hover:text-blue-800  text-white md: hover:text-blue-500" onClick={() => setIsOpen(false)}>Launch VM</Link></li>
                      <li><Link to="/profile" className="text-blue-700 hover:text-blue-800  text-white md: hover:text-blue-500" onClick={() => setIsOpen(false)}>Profile</Link></li>
                      <li><button onClick={handleLogout} className="text-blue-700 hover:text-blue-800  text-white md: hover:text-blue-500">Logout</button></li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/credits-offers" className="text-blue-700 hover:text-blue-800  text-white md: hover:text-blue-500" onClick={() => setIsOpen(false)}>Credits Offers</Link></li>
                      <li><Link to="/login" className="text-blue-700 hover:text-blue-800  text-white md: hover:text-blue-500" onClick={() => setIsOpen(false)}>Login</Link></li>
                      <li><Link to="/register" className="text-blue-700 hover:text-blue-800  text-white md: hover:text-blue-500" onClick={() => setIsOpen(false)}>Register</Link></li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <div className="bg-gray-100 flex-grow pt-8">
          <Routes>
            <Route path="/" element={<><Homepage /></>} /> {/* This is the default route, it will render Homepage component when the path is correct */}
            <Route path="/launch-vm" element={<ProtectedRoute isAuthenticated={isAuthenticated}><JobRequest /></ProtectedRoute>} />
            <Route path="/status-vm" element={<ProtectedRoute isAuthenticated={isAuthenticated}><VMStatus /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><DashboardPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/change-password" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ChangePasswordPage /></ProtectedRoute>} />
            <Route path="/recoverpassword" element={<RecoverPasswordPage />} />
            <Route path="/credits-offers" element={<CreditsOffersPage />} />
            <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
            <Route path="/success" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SuccessPage /> </ProtectedRoute>} />
            <Route path="/cancelled" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CancelledPage /> </ProtectedRoute>} />Ç

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      <ToastContainer />
      <footer className=" shadow mt-0 bg-gray-100">
        <div className="w-full mx-auto max-w-screen-xl p-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 border-b border-gray-200  border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center w-full space-y-2 md:space-y-0">
            <span className="text-sm text-black-800  text-black-200 md:text-left flex-grow md:flex-grow-0">
              © {new Date().getFullYear()} <a>BioCloudLabs™</a>. All Rights Reserved.
            </span>
            <div className="flex justify-center md:justify-center items-center space-x-4">
              <a href="https://github.com/BioCloudLabs/" target='_blank' className="text-black-700 hover:text-black-900  text-black-300  hover:text-white group">
                <svg className="w-6 h-6 group-hover:fill-black fill-gray-700  fill-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">GitHub account</span>
              </a>
              <a href="/about-us" className="font-bold hover:underline">About us</a>
              <div className="relative inline-block text-left">
                <button
                  onClick={toggleDropdown}
                  className="font-bold hover:underline"
                >
                  Contact
                </button>
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 shadow-lg bg-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <p
                        className="block px-4 py-2 text-sm text-black-700 hover:bg-black-100 hover:text-black-900"
                        role="menuitem"
                      >
                        info@biocloudlabs.es
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mx-auto max-w-screen-xl p-4 text-sm text-black-700 sm:text-center  text-black-400 mt-2 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-center md:text-left w-full md:w-auto">
            <a property="dct:title" rel="cc:attributionURL" href="https://github.com/BioCloudLabs/" target='_blank'>BioCloudLabs</a> by
            <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/orgs/BioCloudLabs/people"> BioCloudLabs Team</a> is licensed under
            <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" className="inline-flex items-center">
              &nbsp;CC BY-NC-ND 4.0 {/* Added "&nbsp;" for an extra space */}
              <img className="ml-2 h-5" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt="CC" />
              <img className="ml-2 h-5" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt="BY" />
              <img className="ml-2 h-5" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt="NC" />
              <img className="ml-2 h-5" src="https://mirrors.creativecommons.org/presskit/icons/nd.svg?ref=chooser-v1" alt="ND" />
            </a>
          </p>
        </div>
      </footer>
    </Router>
  );
}

export default App;
