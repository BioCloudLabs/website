import { Offer } from '../models/Offer';
import { getCurrentUserToken } from './userService';

/**
 * Function to handle the user checkout process.
 * @param priceId 
 * @param price 
 * @param navigate 
 * @param onNotAuthenticated 
 * @param onSuccess 
 * @param onError 
 * @returns  A promise that resolves to an array of Offer objects.
 */
export const handleUserCheckout = async (
  priceId: string, price: string, navigate: (path: string) => void,
  onNotAuthenticated: () => void, onSuccess: () => void, onError: (error: string) => void
) => {
  const token = await getCurrentUserToken();
  if (!token) {
    onNotAuthenticated();
    return;
  }

  // Convert price to a number
  const numericPrice = parseFloat(price.replace('€', '').trim());
  if (isNaN(numericPrice)) {
    // console.error('Invalid price value:', price);
    onError('Invalid price value');
    return;
  }
  try {
    await checkout(priceId, numericPrice, navigate);
    onSuccess();
  } catch (error) {
    // console.error('Checkout error:', error);
    if (error instanceof Error) {
      onError(error.message);
    } else {
      onError('Unknown checkout error');
    }
  }
};

/**
 * Function to initiate the checkout process.
 * @param price_id The price ID of the product.
 * @param price The price of the product.
 * @param _navigate The navigate function from the router.
 */
export const checkout = async (price_id: string, price: number, _navigate: (path: string) => void): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    // console.error('Authentication token not found');
    throw new Error('Authentication token not found');
  }

  // // Uncomment below for debugging to check data types before interaction 
  // console.log(`Sending payload:`, { price_id, price });

  if (isNaN(price)) {
    // console.error('Invalid price value:', price);
    throw new Error('Invalid price value');
  }

  // // Uncomment below for debugging to check data types after interaction
  // console.log(`Sending payload:`, { price_id, price });

  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ price_id, price }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    // console.error('HTTP Response Not OK:', errorResponse);
    throw new Error(`HTTP error! Status: ${response.status} - Message: ${errorResponse.message}`);
  }

  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    throw new Error('Checkout URL not found in the response');
  }
};

/**
 * Function to fetch products from the backend.
 * @returns A promise that resolves to an array of Offer objects.
 * @throws An error if the fetch operation fails.
 */
export const fetchProducts = async (): Promise<Offer[]> => {
  try {
    const response = await fetch('/api/stripe/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return data.products.map((product: any) => ({
      name: product.name,
      price: product.price,
      image: '/images/Credits/' + product.name + '.webp',
      priceId: product.price_id,
      credits: product.credits,
    }));
  } catch (error) {
    // console.error('Error fetching products:', error);
    throw error;  // Re-throw the error to handle it in the component (e.g., to show a message)
  }
};

