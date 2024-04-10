import React, { useEffect, useState } from 'react';
import { Offer } from '../models/Offer';
import './../css/CreditsOffersPage.css';
import { fetchProducts } from '../services/creditsService';
import { checkout } from '../services/creditsService';


const CreditsOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    // Call fetchProducts and update state
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setOffers(products);
      } catch (error) {
        console.error('Failed to load products:', error);
        // Optionally handle the error, e.g., by setting an error state and displaying a message
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="/stripe/credits-offers-page/">
      <h1>Available Credit Offers</h1>
      <div className="offers-container">
        {offers.map((offer, index) => (
          <div key={index} className="offer-card">
            <img src={offer.image} alt={offer.name} className="offer-image" />
            <h2>{offer.name}</h2>
            <p>{offer.price}</p>
            {/* Assuming you have a way to map offer names to price IDs */}
            <button onClick={() => checkout(offer.priceId)} className="checkout-button">Checkout</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditsOffersPage;
