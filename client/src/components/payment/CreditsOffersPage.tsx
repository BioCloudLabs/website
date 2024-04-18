import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Offer } from '../../models/Offer';
import { fetchProducts, handleUserCheckout } from '../../services/creditsService';
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
    } finally {
      setLoading(false);
    }
  }

  const notify = (message: string) => {  // Specify type as string
    toast(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const onNotAuthenticated = () => {
    notify("You are not authenticated. Redirecting to login."); // Show notification
    setTimeout(() => navigate('/login'), 5000); // Delay the redirection for 5 seconds to allow the user to read the message
  };

  const onSuccess = () => {
    console.log('Checkout successful!');
    notify("Checkout successful!"); // Show success message
  };

  const onError = (error: string) => {
    console.error('Checkout error:', error);
    notify(error); // Show error message
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
