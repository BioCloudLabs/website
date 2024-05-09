// CreditsOffersPage.test.tsx
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import CreditsOffersPage from '../../../components/payment/CreditsOffersPage';

describe('CreditsOffersPage Tests', () => {
    it('should display correct offer details', () => {
        // Render the component
        render(<CreditsOffersPage />);

        // Assert that the title is displayed
        expect(screen.getByText('Available Credit Offers')).to.exist;
    });

});