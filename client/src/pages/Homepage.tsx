import { useEffect } from 'react';
import './../css/Homepage.css';
import { useLocation, useNavigate } from 'react-router-dom';

function Homepage() {
  const location = useLocation(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isSuccess = searchParams.get('success') === 'true';
    const isCancelled = searchParams.get('canceled') === 'true';
  
    if (isSuccess) {
      navigate('/success'); // Only navigate when a condition is met
    } else if (isCancelled) {
      navigate('/cancelled'); // Only navigate when a condition is met
    }
    // Removed the else clause that navigates to '/' to prevent the loop
  }, [location, navigate]); // Dependencies are fine here

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1 className="title">Welcome to BioCloudLabs</h1>
        <p className="subtitle">The leading platform for omics analysis in the cloud.</p>
      </header>

      <section className="features">
        <h2 className="features-title">Why Choose BioCloudLabs?</h2>
        <div className="features-list">
          {/* Placeholder for features */}
        </div>
      </section>

      <section className="get-started">
        <h2>Ready to Start?</h2>
        <p>Join us today and revolutionize your bioinformatics research.</p>
        <button className="start-button">Get Started</button>
      </section>
    </div>
  );
}

export default Homepage;
