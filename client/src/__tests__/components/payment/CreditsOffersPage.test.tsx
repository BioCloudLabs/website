import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreditsOffersPage from './../../../components/payment/CreditsOffersPage';
import { fetchProducts, handleUserCheckout } from './../../../services/creditsService';
import { Offer } from './../../../models/Offer'; // Import Offer type

jest.mock('./../../../services/creditsService', () => ({
  fetchProducts: jest.fn(),
  handleUserCheckout: jest.fn(),
}));

describe('CreditsOffersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading spinner when loading or checkoutLoading is true', () => {
    render(<CreditsOffersPage />, { wrapper: MemoryRouter });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render available credit offers', async () => {
    const mockOffers: Offer[] = [
      { name: 'Offer 1', price: '10€', priceId: '1', image: 'offer1.jpg' },
      { name: 'Offer 2', price: '20€', priceId: '2', image: 'offer2.jpg' },
    ];
    (fetchProducts as jest.Mock).mockResolvedValue(mockOffers); // Type cast fetchProducts to jest.Mock

    render(<CreditsOffersPage />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('Available Credit Offers')).toBeInTheDocument();
      expect(screen.getByText('Offer 1')).toBeInTheDocument();
      expect(screen.getByText('Offer 2')).toBeInTheDocument();
    });
  });

  it('should call handleUserCheckout when checkout button is clicked', async () => {
    const mockOffers: Offer[] = [
      { name: 'Offer 1', price: '10€', priceId: '1', image: 'offer1.jpg' },
    ];
    (fetchProducts as jest.Mock).mockResolvedValue(mockOffers);
    (handleUserCheckout as jest.Mock).mockResolvedValue({ success: true });

    render(<CreditsOffersPage />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('Offer 1')).toBeInTheDocument();
      const checkoutButton = screen.getByRole('button', { name: 'Checkout' });
      checkoutButton.click();
    });

    expect(handleUserCheckout).toHaveBeenCalledWith('1'); // Ensure handleUserCheckout is called with correct priceId
  });

  // Add other test cases...

});
