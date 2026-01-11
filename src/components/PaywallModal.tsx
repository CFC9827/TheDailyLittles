/**
 * Paywall Modal
 * 
 * Premium upgrade prompt with pricing options
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { redirectToCheckout, PRODUCTS } from '../services/stripe';
import './PaywallModal.css';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Plan = 'monthly' | 'yearly';

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose }) => {
    const { isAuthenticated } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<Plan>('yearly');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubscribe = async () => {
        if (!isAuthenticated) {
            // Show auth modal first
            return;
        }

        setIsLoading(true);
        const priceId = selectedPlan === 'monthly' ? PRODUCTS.MONTHLY : PRODUCTS.YEARLY;
        await redirectToCheckout(priceId);
        setIsLoading(false);
    };

    const monthlyPrice = 4.99;
    const yearlyPrice = 39.99;
    const yearlyMonthly = (yearlyPrice / 12).toFixed(2);
    const savings = Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100);

    return (
        <div className="paywall__overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="paywall">
                <button className="paywall__close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <div className="paywall__header">
                    <div className="paywall__badge">Premium</div>
                    <h2 className="paywall__title">Unlock Everything</h2>
                    <p className="paywall__subtitle">
                        Get unlimited access to all puzzles, past challenges, and more.
                    </p>
                </div>

                <div className="paywall__features">
                    <div className="paywall__feature">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Full puzzle library</span>
                    </div>
                    <div className="paywall__feature">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Past daily challenges</span>
                    </div>
                    <div className="paywall__feature">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Extended statistics</span>
                    </div>
                    <div className="paywall__feature">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>No ads, ever</span>
                    </div>
                </div>

                <div className="paywall__plans">
                    <button
                        className={`paywall__plan ${selectedPlan === 'yearly' ? 'paywall__plan--selected' : ''}`}
                        onClick={() => setSelectedPlan('yearly')}
                    >
                        <div className="paywall__plan-badge">Best Value</div>
                        <div className="paywall__plan-name">Yearly</div>
                        <div className="paywall__plan-price">
                            <span className="paywall__plan-amount">${yearlyPrice}</span>
                            <span className="paywall__plan-period">/year</span>
                        </div>
                        <div className="paywall__plan-savings">
                            ${yearlyMonthly}/mo · Save {savings}%
                        </div>
                    </button>

                    <button
                        className={`paywall__plan ${selectedPlan === 'monthly' ? 'paywall__plan--selected' : ''}`}
                        onClick={() => setSelectedPlan('monthly')}
                    >
                        <div className="paywall__plan-name">Monthly</div>
                        <div className="paywall__plan-price">
                            <span className="paywall__plan-amount">${monthlyPrice}</span>
                            <span className="paywall__plan-period">/month</span>
                        </div>
                    </button>
                </div>

                <button
                    className="paywall__cta"
                    onClick={handleSubscribe}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Start Premium'}
                </button>

                <p className="paywall__terms">
                    Cancel anytime. Secure payment via Stripe.
                </p>
            </div>
        </div>
    );
};
