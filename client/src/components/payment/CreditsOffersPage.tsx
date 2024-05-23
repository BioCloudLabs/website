import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Offer } from '../../models/Offer';
import { fetchProducts, handleUserCheckout } from '../../services/creditsService';
import { notify } from '../../utils/notificationUtils';

const CreditsOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const products = await fetchProducts();
      setOffers(products);
      setError(null); // Reset error state on successful fetch
    } catch (error) {
      console.error('Failed to load products:', error);
      setError('Failed to load products. Please try again later.');
      toast.error('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onNotAuthenticated = () => {
    notify("You are not authenticated. Redirecting to login.", "info");
    setCheckoutLoading(false);
    setTimeout(() => navigate('/login'), 2500);
  };

  const onSuccess = () => {
    toast.success("Checkout successful!");
    setTimeout(() => {
      navigate('/');
      setCheckoutLoading(false);
    }, 2500);
  };

  const onError = (error: string) => {
    toast.error(error);
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
          <div className="loader animate-spin rounded-full border-t-4 border-b-4 border-blue-500 w-12 h-12"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-red-500 mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="credits-offers-page">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center pt-4 my-12">Available Credits Offers</h1>
      <div className="flex justify-center flex-wrap gap-x-4 gap-y-1">
        {offers.length > 0 ? (
          offers.map((offer, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg w-64 p-2 flex flex-col items-center text-center m-2">
              <img src={offer.image} alt={`Offer: ${offer.name}`} className="w-5/6 h-auto rounded-lg mb-4" />
              <h2 className="text-lg font-semibold text-gray-500">{offer.name}</h2>
              <p className="text-gray-600">{offer.price}</p>
              <button
                onClick={() => handleCheckoutClick(offer.priceId, parseFloat(offer.price.replace('€', '').trim()))}
                className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer mt-3 transition-colors duration-300 hover:bg-blue-500"
              >
                Checkout
              </button>
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
