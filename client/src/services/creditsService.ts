import { Offer } from '../models/Offer'; // Exported model for 


export const checkout = async (price_id: string, price: string): Promise<void> => {
  try {
    const parsedPrice = parseFloat(price.replace(' €', ''));
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
      window.location.href = data.url;
    } else {
      console.error('Checkout URL not found in the response');
    }
  } catch (error) {
    console.error('Error during checkout:', error);
  }
};


// Function to fetch products from the backend
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

    // Adjust the mapping to match the server response
    return data.products.map((product: any) => ({
      name: product.name,
      price: product.price,
      image: '/images/Credits/' + product.name + '.webp', // Use the image mapping to assign the correct image
      priceId: product.price_id,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw the error if you want to handle it in the component (e.g., to show a message)
  }
};
