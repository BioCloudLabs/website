import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Offer } from '../../models/Offer';
import { fetchProducts, handleUserCheckout } from '../../services/creditsService';
import { notify } from '../../utils/notificationUtils'; 
import './../../css/CreditsOffersPage.css';

const CreditsOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const products = await fetchProducts();
      setOffers(products);
    } catch (error) {
      console.error('Failed to load products:', error);
      notify('Failed to load products.'); // Use notify from utility
    } finally {
      setLoading(false);
    }
  };

  const onNotAuthenticated = () => {
    notify("You are not authenticated. Redirecting to login.");
    setTimeout(() => navigate('/login'), 5000);
  };

  const onSuccess = () => {
    notify("Checkout successful!"); 
  };

  const onError = (error: string) => {
    notify(error); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>
          <h1>Loading..</h1>
          <div className="loader animate-spin rounded-full border-t-4 border-b-4 border-green-400 w-16 h-16"></div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="credits-offers-page">
      <ToastContainer /> {/* Add the ToastContainer component */}
      <h1 className="text-center text-3xl font-bold">Available Credit Offers</h1>
      <div className="offers-container">
        {offers.length > 0 ? (
          offers.map((offer, index) => (
            <div key={index} className="offer-card">
              <img src={offer.image} alt={offer.name} className="offer-image" />
              <h2>{offer.name}</h2>
              <p>{offer.price}</p>
              <button onClick={() => handleUserCheckout(offer.priceId, parseFloat(offer.price.replace('€', '').trim()), navigate, onNotAuthenticated, onSuccess, onError)}
                      className="checkout-button">Checkout</button>
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