import React, { useState } from 'react';
import './App.css';
import Homepage from './pages/Homepage';
import BlastPage from './pages/BlastPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  // State to track the current page
  const [currentPage, setCurrentPage] = useState('home');

  // Function to render the current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage />;
      case 'blast':
        return <BlastPage />;
      case 'dashboard':
        return <DashboardPage />;
      default:
        return <Homepage />;
    }
  };

  return (
    <div className="App">
      {/* Basic navigation */}
      <div className="navigation">
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('blast')}>BLAST</button>
        <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
      </div>
      {/* Page content */}
      {renderPage()}
    </div>
  );
}

export default App;
