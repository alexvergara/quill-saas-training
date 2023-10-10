import type { Stripe } from 'stripe';

export const PAYMENT_METHOD_TYPES: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ['card', 'paypal'];
