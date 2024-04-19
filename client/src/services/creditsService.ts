import { Offer } from '../models/Offer';
import { getCurrentUserToken } from './userService';

export const handleUserCheckout = async (
  priceId: string, price: number, navigate: (path: string) => void, 
  onNotAuthenticated: () => void, onSuccess: () => void, onError: (error: string) => void
) => {
  const token = await getCurrentUserToken();
  if (!token) {
    onNotAuthenticated(); // Call the onNotAuthenticated callback if the user is not authenticated
  } else {
    try {
      await checkout(priceId, price.toString(), navigate);
      onSuccess(); // Call the onSuccess callback when checkout is successful
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      if (error instanceof Error) {
        onError(error.message); // Now TypeScript knows error is an instance of Error and thus has a message property
      } else {
        onError('Checkout error'); // Default error message if it's not an instance of Error
      }
    }
  }
};


export const checkout = async (price_id: string, price: string, navigate: (path: string) => void): Promise<void> => {
  try {
    const parsedPrice = parseFloat(price.replace('€', '').trim());
    if (isNaN(parsedPrice)) {
      throw new Error('Invalid price');
    }

    const response = await fetch('/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Instead of Authoriation it would be Cookie : 
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
    throw error;  // Re-throw the error to handle it in the component (e.g., to show a message)
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
    throw error;  // Re-throw the error to handle it in the component (e.g., to show a message)
  }
};