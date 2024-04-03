import { useEffect, useState } from 'react';
import './../css/Homepage.css'; // Assume you have a CSS file for homepage-specific styles
import { User } from './../models/User';



function Homepage() {
  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    // Inside your useEffect in Homepage.tsx
    fetch('/showdata') // Removed 'api' from the path
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setUserData(data.data))
      .catch(error => console.error('Fetching data failed:', error));

  }, []);


  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1 className="title">Welcome to BioCloudLabs</h1>
        <p className="subtitle">The leading platform for omics analysis in the cloud.</p>
      </header>

      {/* Display the fetched user data */}
      <section className="user-data">
        <h2 className="data-title">User Database Data:</h2>
        <ul>
          {userData.map((user, index) => (
            <li key={index}>
              {user.name}, Surname: {user.surname}
            </li>
          ))}
        </ul>
      </section>

      <section className="features">
        <h2 className="features-title">Why Choose BioCloudLabs?</h2>
        <div className="features-list">
          <div className="feature">
            <h3>High Performance</h3>
            <p>Experience fast and reliable analysis of your genomic data.</p>
          </div>
          <div className="feature">
            <h3>Accessibility</h3>
            <p>Access your projects from anywhere, at any time.</p>
          </div>
          <div className="feature">
            <h3>Unlimited Cloud Usage</h3>
            <p>Enjoy unlimited access to our cloud resources without any restrictions.</p>
          </div>
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
