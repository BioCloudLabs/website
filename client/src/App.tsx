import { useState } from 'react';
import './App.css';
import Homepage from './pages/Homepage';
import BlastPage from './pages/BlastPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LogoutButton from './components/LogoutButton';


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home'); // Redirect to home or another page as appropriate
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage />;
      case 'blast':
        return <BlastPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />; 
        case 'register':
          return <RegisterPage />;
      
      default:
        return <Homepage />;
    }
  };

  return (
    <div className="App">
      <div className="navigation">
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('blast')}>BLAST</button>
        {isAuthenticated ? (
          <>
            <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
            <LogoutButton onLogout={handleLogout} />
          </>
        ) : (
          <>
            <button onClick={() => setCurrentPage('login')}>Login</button>
            <button onClick={() => setCurrentPage('register')}>Register</button>
          </>
        )}
      </div>
      {renderPage()}
    </div>
  );
}

export default App;
