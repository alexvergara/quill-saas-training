import type { Stripe } from 'stripe';

export const PAYMENT_METHOD_TYPES: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ['card', 'paypal'];

export const STRIPE_PLANS = [
  {
    name: 'Free',
    slug: 'free',
    quota: 10,
    pagesPerPdf: 5,
    price: {
      amount: 0,
      priceIds: {
        test: '',
        production: ''
      }
    }
  },
  {
    name: 'Basic',
    slug: 'basic',
    quota: 50,
    pagesPerPdf: 25,
    price: {
      amount: 14,
      priceIds: {
        test: 'price_1NuEwTA19umTXGu8MeS3hN8L',
        production: ''
      }
    }
  }
];
