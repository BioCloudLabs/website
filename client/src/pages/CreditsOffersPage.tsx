import React, { useState } from 'react';
import { Offer } from '../models/Offer';
import './../css/CreditsOffersPage.css';
import { checkout } from '../services/creditsService';

// Mapping from number of credits to price_id
const priceMapping: { [key: string]: string } = {
  '20': 'price_1P3K8zKxx03CCQEhdO1g0mBB',
  '50': 'price_1P3K7AKxx03CCQEhm21AsrlK',
  '100': 'price_1P3K63Kxx03CCQEhyut5FVXM',
  '500': 'price_1P3K6eKxx03CCQEh6rQhhxI5',
  '1000': 'price_1P3K3cKxx03CCQEhUDSDHili',
};

const CreditsOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([
    { name: '20 Credits', price: '1,50 €', image: './../../public/images/20_credits.webp' },
    { name: '50 Credits', price: '2,60 €', image: './../../public/images/50_credits.webp' },
    { name: '100 Credits', price: '3,99 €', image: './../../public/images/100_credits.webp' },
    { name: '500 Credits', price: '16,99 €', image: './../../public/images/500_credits.webp' },
    { name: '1.000 Credits', price: '27,99 €', image: './../../public/images/1000_credits.webp' },
  ]);


  return (
    <div className="/stripe/credits-offers-page">
      <h1>Available Credit Offers</h1>
      <div className="offers-container">
        {offers.map((offer, index) => {
          return (
            <div key={index} className="offer-card">
              <img src={offer.image} alt={offer.name} className="offer-image" />
              <h2>{offer.name}</h2>
              <p>{offer.price}</p>
              <button onClick={() => checkout(priceMapping[offer.name.split(' ')[0].replace('.', '')])} className="checkout-button">Checkout</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreditsOffersPage;
