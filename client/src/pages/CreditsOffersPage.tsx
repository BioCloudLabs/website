import React, { useState, useEffect } from 'react';
// Add your preferred method of styling here

// Define the Offer interface
interface Offer {
  name: string;
  price: string;
  category: string;
  created: string;
  updated: string;
}

const CreditsOffersPage = () => {
  // Type the state with the Offer interface
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    // Fetch the offers from an API or your state management
    const mockData: Offer[] = [
      { name: '20 Credits', price: '1,50 €', category: 'General - Electronically Supplied Services', created: '8 abr.', updated: '8 abr.' },
      // ...other offers
    ];

    setOffers(mockData);
  }, []);

  return (
    <div className="credits-offers-page">
      <h1>Available Credit Offers</h1>
      <div className="offers-container">
        {offers.map((offer, index) => (
          <div key={index} className="offer-card">
            <h2>{offer.name}</h2>
            <p>{offer.price}</p>
            <p>{offer.category}</p>
            <p>Created: {offer.created}</p>
            <p>Last Updated: {offer.updated}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add styles for the page, container, and cards here

export default CreditsOffersPage;
