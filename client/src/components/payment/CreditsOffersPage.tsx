import React, { useEffect, useState } from 'react';
import { Offer } from '../../models/Offer';
import { fetchProducts, handleUserCheckout } from '../../services/creditsService';
import './../../css/CreditsOffersPage.css';
import { useNavigate } from 'react-router-dom';

const CreditsOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setOffers(products);
      } catch (error) {
        console.error('Failed to load products:', error);
        setFeedback('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const onNotAuthenticated = () => {
    navigate('/login');
    setFeedback('You must be logged in to complete the checkout.');
  };

  const onSuccess = () => {
    setFeedback('Checkout successful! Redirecting...');
  };

  const onError = (error: string) => {
    setFeedback(`Error during checkout: ${error}`);
  };

  const checkoutOffer = (priceId: string, price: string) => {
    handleUserCheckout(priceId, Number(price), onNotAuthenticated, onSuccess, onError);
  };

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
              <h2 className="offer-title">{offer.name}</h2>
              <p className="offer-price">{offer.price}</p>
              <button onClick={() => checkoutOffer(offer.priceId, offer.price)} className="checkout-button">
                Checkout
              </button>
            </div>
          ))
        ) : (
          <p className="text-center">No offers available at this time.</p>
        )}
      </div>
      {feedback && <div className="feedback-message">{feedback}</div>}
    </div>
  );
};

export default CreditsOffersPage;
