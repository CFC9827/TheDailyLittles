/**
 * Notification Settings Component
 * 
 * Manage SMS notification preferences
 */

import React, { useState, useEffect } from 'react';
import {
    getNotificationPreferences,
    saveNotificationPreferences,
    requestPhoneVerification,
    verifyPhone,
    type NotificationPreferences
} from '../services/twilio';
import './NotificationSettings.css';

interface NotificationSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
    isOpen,
    onClose
}) => {
    const [prefs, setPrefs] = useState<NotificationPreferences>(getNotificationPreferences());
    const [phoneInput, setPhoneInput] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [step, setStep] = useState<'settings' | 'enter-phone' | 'verify'>('settings');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setPrefs(getNotificationPreferences());
            setStep('settings');
            setError(null);
        }
    }, [isOpen]);

    const handleToggle = (key: keyof NotificationPreferences) => {
        if (key === 'smsEnabled' && !prefs.phoneVerified) {
            setStep('enter-phone');
            return;
        }

        const newPrefs = { ...prefs, [key]: !prefs[key] };
        setPrefs(newPrefs);
        saveNotificationPreferences(newPrefs);
    };

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const { error } = await requestPhoneVerification(phoneInput);

        setIsLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setStep('verify');
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const { error } = await verifyPhone(codeInput);

        setIsLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setPrefs(getNotificationPreferences());
            setStep('settings');
        }
    };

    const formatPhone = (phone: string | null) => {
        if (!phone) return '';
        if (phone.length === 10) {
            return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
        }
        return phone;
    };

    if (!isOpen) return null;

    return (
        <div className="notif-settings__overlay" onClick={onClose}>
            <div className="notif-settings" onClick={e => e.stopPropagation()}>
                <button className="notif-settings__close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                {step === 'settings' && (
                    <>
                        <h2 className="notif-settings__title">Notifications</h2>

                        {prefs.phoneVerified && (
                            <div className="notif-settings__phone">
                                <span>📱</span>
                                <span>{formatPhone(prefs.phoneNumber)}</span>
                                <span className="notif-settings__verified">Verified</span>
                            </div>
                        )}

                        <div className="notif-settings__options">
                            <label className="notif-settings__option">
                                <div className="notif-settings__option-info">
                                    <span className="notif-settings__option-title">SMS Notifications</span>
                                    <span className="notif-settings__option-desc">
                                        {prefs.phoneVerified
                                            ? 'Receive texts for important updates'
                                            : 'Add your phone number to enable'
                                        }
                                    </span>
                                </div>
                                <button
                                    className={`notif-settings__toggle ${prefs.smsEnabled ? 'notif-settings__toggle--on' : ''}`}
                                    onClick={() => handleToggle('smsEnabled')}
                                >
                                    <span className="notif-settings__toggle-dot" />
                                </button>
                            </label>

                            {prefs.smsEnabled && (
                                <>
                                    <label className="notif-settings__option notif-settings__option--sub">
                                        <div className="notif-settings__option-info">
                                            <span className="notif-settings__option-title">Friend Completions</span>
                                            <span className="notif-settings__option-desc">
                                                When a mutual finishes the daily challenge
                                            </span>
                                        </div>
                                        <button
                                            className={`notif-settings__toggle ${prefs.notifyOnMutualComplete ? 'notif-settings__toggle--on' : ''}`}
                                            onClick={() => handleToggle('notifyOnMutualComplete')}
                                        >
                                            <span className="notif-settings__toggle-dot" />
                                        </button>
                                    </label>

                                    <label className="notif-settings__option notif-settings__option--sub">
                                        <div className="notif-settings__option-info">
                                            <span className="notif-settings__option-title">Group Activity</span>
                                            <span className="notif-settings__option-desc">
                                                When group members post notable scores
                                            </span>
                                        </div>
                                        <button
                                            className={`notif-settings__toggle ${prefs.notifyOnGroupComplete ? 'notif-settings__toggle--on' : ''}`}
                                            onClick={() => handleToggle('notifyOnGroupComplete')}
                                        >
                                            <span className="notif-settings__toggle-dot" />
                                        </button>
                                    </label>
                                </>
                            )}
                        </div>
                    </>
                )}

                {step === 'enter-phone' && (
                    <form onSubmit={handleSendCode}>
                        <h2 className="notif-settings__title">Add Phone Number</h2>
                        <p className="notif-settings__subtitle">
                            We'll text you a code to verify your number.
                        </p>

                        {error && <div className="notif-settings__error">{error}</div>}

                        <input
                            type="tel"
                            className="notif-settings__input"
                            placeholder="(555) 123-4567"
                            value={phoneInput}
                            onChange={e => setPhoneInput(e.target.value)}
                            autoFocus
                        />

                        <div className="notif-settings__actions">
                            <button type="button" onClick={() => setStep('settings')}>
                                Cancel
                            </button>
                            <button type="submit" disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send Code'}
                            </button>
                        </div>
                    </form>
                )}

                {step === 'verify' && (
                    <form onSubmit={handleVerify}>
                        <h2 className="notif-settings__title">Enter Code</h2>
                        <p className="notif-settings__subtitle">
                            We sent a 6-digit code to your phone.
                        </p>

                        {error && <div className="notif-settings__error">{error}</div>}

                        <input
                            type="text"
                            className="notif-settings__input notif-settings__input--code"
                            placeholder="000000"
                            value={codeInput}
                            onChange={e => setCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            autoFocus
                        />

                        <div className="notif-settings__actions">
                            <button type="button" onClick={() => setStep('enter-phone')}>
                                Back
                            </button>
                            <button type="submit" disabled={isLoading || codeInput.length !== 6}>
                                {isLoading ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
