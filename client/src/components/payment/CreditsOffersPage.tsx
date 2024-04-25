import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Offer } from '../../models/Offer';
import { fetchProducts, handleUserCheckout } from '../../services/creditsService';
import { notify } from '../../utils/notificationUtils'; 

const CreditsOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
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
      notify('Failed to load products.', "error"); // Use notify from utility
    } finally {
      setLoading(false);
    }
  };

  const onNotAuthenticated = () => {
    notify("You are not authenticated. Redirecting to login.", "info");
    setCheckoutLoading(false); // Reset loading state
    setTimeout(() => navigate('/login'), 2500);
  };
  
  const onSuccess = () => {
    notify("Checkout successful!", "success"); 
    setTimeout(() => {
      navigate('/');
      setCheckoutLoading(false);
    }, 2500); // Redirect to home after 2.5 seconds
  };

  const onError = (error: string) => {
    notify(error, "error"); 
    setCheckoutLoading(false);
  };

  const handleCheckoutClick = (priceId: string, price: number) => {
    setCheckoutLoading(true);
    handleUserCheckout(priceId, price.toString(), navigate, onNotAuthenticated, onSuccess, onError);
  };

  if (loading || checkoutLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center">
                <h1 className="text-lg font-semibold text-blue-500 mb-4">Loading...</h1>
                <div className="loader animate-spin rounded-full border-t-4 border-b-4 border-green-500 w-12 h-12"></div>
            </div>
        </div>
    );
  }

  return (
    <div className="credits-offers-page">
      <ToastContainer />
      <h1 className="text-center text-2xl font-bold my-2">Available Credit Offers</h1>
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-2">
        {offers.length > 0 ? (
          offers.map((offer, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg w-64 p-2 flex flex-col items-center text-center m-2">
              <img src={offer.image} alt={offer.name} className="w-full h-auto rounded-lg mb-4" />
              <h2 className="text-lg font-semibold text-gray-500">{offer.name}</h2>
              <p className="text-gray-600">{offer.price}</p>
              <button onClick={() => handleCheckoutClick(offer.priceId, Number(offer.price))}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-3 transition-colors duration-300 hover:bg-blue-400">Checkout</button>
            </div>
          ))
        ) : (
          <p className="text-center">No offers available at this time.</p>
        )}
      </div>
    </div>
  );
}
  
export default CreditsOffersPage;