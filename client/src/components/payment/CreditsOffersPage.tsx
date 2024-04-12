import React, { useEffect, useState } from 'react';
import { Offer } from '../../models/Offer';
import { fetchProducts, checkout } from '../../services/creditsService';
import './../../css/CreditsOffersPage.css';

const CreditsOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setOffers(products);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="credits-offers-page-loading">
        <h1>Loading Offers...</h1>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="credits-offers-page">
      <h1 className="text-center text-3xl font-bold">Available Credit Offers</h1>
      <div className="offers-container">
        {offers.length > 0 ? (
          offers.map((offer, index) => (
            <div key={index} className="offer-card">
              <img src={offer.image} alt={offer.name} className="offer-image" />
              <h2>{offer.name}</h2>
              <p>{offer.price}</p>
              <button onClick={() => checkout(offer.priceId, offer.price)} className="checkout-button">Checkout</button>
            </div>
          ))
        ) : (
          <p className="text-center">No offers available at this time.</p>
        )}
      </div>
    </div>
  );
};

export default CreditsOffersPage;
