/**
 * Stripe Client
 * 
 * Handles Stripe integration for premium subscriptions
 */

import { loadStripe, type Stripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripePromise: Promise<Stripe | null> = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

/**
 * Get Stripe instance
 */
export async function getStripe(): Promise<Stripe | null> {
    return stripePromise;
}

/**
 * Product IDs (configure these in Stripe Dashboard)
 */
export const PRODUCTS = {
    MONTHLY: 'price_monthly', // Replace with actual price ID
    YEARLY: 'price_yearly',   // Replace with actual price ID
};

/**
 * Create checkout session and redirect to Stripe
 * 
 * In production, this should call your backend to create the session.
 * For now, we'll redirect to a placeholder.
 */
export async function redirectToCheckout(priceId: string): Promise<void> {
    const stripe = await getStripe();

    if (!stripe) {
        console.error('Stripe not loaded');
        return;
    }

    // In production, call your backend:
    // const { sessionId } = await fetch('/api/create-checkout-session', {
    //     method: 'POST',
    //     body: JSON.stringify({ priceId }),
    // }).then(r => r.json());

    // For now, show alert
    console.log('Would redirect to Stripe checkout for:', priceId);
    alert('Stripe checkout would open here. Configure VITE_STRIPE_PUBLISHABLE_KEY and backend.');
}

/**
 * Create customer portal session
 * 
 * Allows users to manage their subscription
 */
export async function redirectToCustomerPortal(): Promise<void> {
    // In production, call your backend:
    // const { url } = await fetch('/api/create-portal-session', {
    //     method: 'POST',
    // }).then(r => r.json());
    // window.location.href = url;

    console.log('Would redirect to Stripe customer portal');
    alert('Customer portal would open here. Configure backend.');
}
