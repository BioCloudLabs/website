// Function to handle the checkout process
export const checkout = async (priceId: string): Promise<void> => {
    try {
      const response = await fetch('/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price_id: priceId }),
      });
      const data = await response.json();
      // Handle the response, such as redirecting to the checkout URL
      console.log(data);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };
  