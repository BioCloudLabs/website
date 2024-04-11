import { Offer } from '../models/Offer'; // Exported model for 


// Function to handle the checkout process
export const checkout = async (priceId: string): Promise<void> => {
  try {
    const response = await fetch('/stripe/create-checkout-session/' + priceId, {
      method: 'GET', // Your current method is GET; ensure this aligns with your server setup
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Redirect to the Stripe checkout URL if available
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

    // Create a mapping between product names and image file names
    // const imageMapping: { [key: string]: string } = {
    //   '20 Credits': '/images/Credits/20_credits.webp',
    //   '50 Credits': '/images/Credits/50_credits.webp',
    //   '100 Credits': 'images/Credits/100_credits.webp',
    //   '500 Credits': '/images/Credits/500_credits.webp',
    //   '1.000 Credits': '/images/Credits/1000_credits.webp',
    // };




    // Adjust the mapping to match the server response
    return data.products.map((product: any) => ({
      name: product.name,
      price: product.price,
      image: '/images/Credits/' + product.name + '.webp', // Use the image mapping to assign the correct image
      priceId: product.price_id, // Use underscore to match server response
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw the error if you want to handle it in the component (e.g., to show a message)
  }
};
