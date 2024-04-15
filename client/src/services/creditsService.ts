import { Offer } from '../models/Offer';
import { getCurrentUserToken } from './userService';

export const handleUserCheckout = async (priceId: string, price: number, onNotAuthenticated: () => void, onSuccess: () => void, onError: (error: string) => void) => {
  const user = await getCurrentUserToken();
  if (!user) {
    onNotAuthenticated(); // Call the onNotAuthenticated callback if the user is not authenticated
  } else {
    try {
      await checkout(priceId, price.toString());
      onSuccess(); // Call the onSuccess callback when checkout is successful
    } catch (error) {
      // console.error('Checkout error:', error);
      onError('Checkout error'); // Call the onError callback when there is an error during checkout
    }
  }
};

export const checkout = async (price_id: string, price: string): Promise<void> => {
  try {
    const parsedPrice = parseFloat(price.replace('€', '').trim());
    if (isNaN(parsedPrice)) {
      throw new Error('Invalid price');
    }

    const response = await fetch('/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ price_id, price: parsedPrice }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;  // Redirect to the payment URL
    } else {
      throw new Error('Checkout URL not found in the response');
    }
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};


/**
 * Function to fetch products from the backend.
 */
export const fetchProducts = async (): Promise<Offer[]> => {
  try {
    const response = await fetch('/stripe/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.products.map((product: any) => ({
      name: product.name,
      price: product.price,
      image: '/images/Credits/' + product.name + '.webp',
      priceId: product.price_id,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;  // Re-throw the error if you want to handle it in the component (e.g., to show a message)
  }
};
