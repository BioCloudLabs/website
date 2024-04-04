import { useEffect, useState } from 'react';
import './../css/Homepage.css'; // Ensure the path is correct
import { User } from './../models/User';

// Function to map API user data to your User interface
const mapApiUserToUser = (apiUser: any): User => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    // The API does not provide a password, so use a placeholder or fetch from somewhere else if needed
    password: 'placeholder-password',
    name: apiUser.first_name,
    surname: apiUser.last_name,
    // You can use the current date or fetch the actual dates if your API provides them
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Use default values or adapt as necessary
    role: 'user', // Default role, adjust as needed
    credits: 0, // Default credits, adjust as needed
    location_id: 1, // Default location ID, adjust as needed
  };
};

function Homepage() {
  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    // Fetching data from the new API endpoint
    fetch('https://reqres.in/api/users?page=2')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(apiResponse => {
        // Map the API response to your User interface
        const users = apiResponse.data.map(mapApiUserToUser);
        setUserData(users);
      })
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
          {userData.map(user => (
            <li key={user.id}>
              {user.name} {user.surname}
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
