import { useState } from 'react';
import './App.css';
import Homepage from './pages/Homepage';
import BlastPage from './pages/BlastPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleLogin = () => {
    setCurrentPage('dashboard'); // Update the current page to the dashboard upon successful login
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
        return <LoginPage onLogin={handleLogin} />; // Pass the handleLogin function as a prop
      default:
        return <Homepage />;
    }
  };

  return (
    <div className="App">
      <div className="navigation">
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('blast')}>BLAST</button>
        <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
        <button onClick={() => setCurrentPage('login')}>Login</button>
      </div>
      {renderPage()}
    </div>
  );
}

export default App;
