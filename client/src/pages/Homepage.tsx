import { useEffect, useState } from 'react';
import './../css/Homepage.css';
import { User } from './../models/User';
import { useLocation } from 'react-router-dom';

const mapApiUserToUser = (apiUser: any): User => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    password: 'placeholder-password',
    name: apiUser.first_name,
    surname: apiUser.last_name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    role_id: 1,
    credits: 0,
    location_id: 1,
  };
};

function Homepage() {
  const [userData, setUserData] = useState<User[]>([]);
  const location = useLocation(); // Now correctly using useLocation

  useEffect(() => {
    fetch('https://reqres.in/api/users?page=2')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(apiResponse => {
        const users = apiResponse.data.map(mapApiUserToUser);
        setUserData(users);
      })
      .catch(error => console.error('Fetching data failed:', error));
  }, []);

  const searchParams = new URLSearchParams(location.search);
  const isSuccess = searchParams.get('success') === 'true';

  return (
    <div className="homepage-container">
      {isSuccess && (
        <div className="success-message">
          <h2>Success!</h2>
          <p>Your operation was successful.</p>
        </div>
      )}
      <header className="homepage-header">
        <h1 className="title">Welcome to BioCloudLabs</h1>
        <p className="subtitle">The leading platform for omics analysis in the cloud.</p>
      </header>

      <section className="user-data">
        <h2 className="data-title">User Database Data:</h2>
        <ul>
          {userData.map(user => (
            <li key={user.id}>{user.name} {user.surname}</li>
          ))}
        </ul>
      </section>

      <section className="features">
        <h2 className="features-title">Why Choose BioCloudLabs?</h2>
        <div className="features-list">
          {/* features */}
        </div>
      </section>

      <section className="get-started">
        <h2>Ready to Start?</h2>
        <p>Join us today and revolutionize your bioinformatics research.</p>
        <button className="start-button">Get Started</button>
      </section>
    </div> // Ensure this closing tag matches the opening tag of the container
  );
}

export default Homepage;
