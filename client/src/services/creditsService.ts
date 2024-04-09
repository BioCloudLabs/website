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
