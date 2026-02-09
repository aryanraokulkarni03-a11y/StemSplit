'use client';

import { useState, useEffect } from 'react';

/**
 * Cookie Consent Component
 * 
 * GDPR/CCPA Compliance: Cookie consent banner
 * 
 * Features:
 * - Accept/Reject cookies
 * - Persistent storage (localStorage)
 * - Analytics integration
 * - Customizable categories
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setShowBanner(false);

        // Enable analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                analytics_storage: 'granted',
            });
        }
    };

    const handleReject = () => {
        localStorage.setItem('cookie-consent', 'rejected');
        setShowBanner(false);

        // Disable analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                analytics_storage: 'denied',
            });
        }
    };

    if (!showBanner) return null;

    return (
        <div className="cookie-consent" data-component="cookie-consent">
            <div className="cookie-consent-container">
                <div className="cookie-consent-content">
                    <h3>Cookie Consent</h3>
                    <p>
                        We use cookies to enhance your experience, analyze site traffic, and for marketing purposes.
                        By clicking "Accept", you consent to our use of cookies.
                    </p>
                    <p className="cookie-consent-links">
                        <a href="/privacy" target="_blank" rel="noopener noreferrer">
                            Privacy Policy
                        </a>
                        {' | '}
                        <a href="/cookies" target="_blank" rel="noopener noreferrer">
                            Cookie Policy
                        </a>
                    </p>
                </div>

                <div className="cookie-consent-actions">
                    <button
                        onClick={handleReject}
                        className="cookie-consent-button reject"
                        aria-label="Reject cookies"
                    >
                        Reject
                    </button>
                    <button
                        onClick={handleAccept}
                        className="cookie-consent-button accept"
                        aria-label="Accept cookies"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
