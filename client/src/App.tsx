import { useState } from 'react';
import './App.css';
import Homepage from './pages/Homepage';
import BlastPage from './pages/BlastPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LogoutButton from './components/LogoutButton';
import ForgotPasswordPage from './pages/ForgotPasswordPage';



function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home'); 
  };

  const renderPage = () => {
    if (currentPage === 'dashboard' && !isAuthenticated) {
      return <LoginPage onLogin={handleLogin} onForgotPassword={() => setCurrentPage('forgotPassword')} />;
    }
  
    switch (currentPage) {
      case 'home':
        return <Homepage />;
      case 'blast':
        return <BlastPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onForgotPassword={() => setCurrentPage('forgotPassword')} />;
      case 'register':
        return <RegisterPage />;
      case 'forgotPassword': // Make sure this case is exactly matching the string you use to set the current page
        return <ForgotPasswordPage />;
      default:
        return <Homepage />;
    }
  };
  

  return (
    <div className="App">
      <div className="navigation">
        <div className="nav-left">
          <button onClick={() => setCurrentPage('home')}>Home</button>
          <button onClick={() => setCurrentPage('blast')}>BLAST</button>
          {isAuthenticated && (
            <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
          )}
        </div>
        <div className="nav-right">
          {isAuthenticated ? (
            <LogoutButton onLogout={handleLogout} />
          ) : (
            <>
              <button onClick={() => setCurrentPage('login')}>Login</button>
              <button onClick={() => setCurrentPage('register')}>Register</button>
            </>
          )}
        </div>
      </div>
      {renderPage()}
    </div>
  );
}

export default App;