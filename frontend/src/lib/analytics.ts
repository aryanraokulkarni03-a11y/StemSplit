/**
 * Google Analytics Integration
 * 
 * Google Analytics 4 (GA4) tracking utilities
 * Tracks page views, events, conversions, and user behavior
 */

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// gtag typings are centralized in frontend/src/types/gtag.d.ts

/**
 * Check if Google Analytics is enabled
 */
export const isGAEnabled = (): boolean => {
    return !!GA_MEASUREMENT_ID && typeof window !== 'undefined';
};

/**
 * Page view tracking
 */
export const pageview = (url: string) => {
    if (!isGAEnabled()) return;

    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
    });
};

/**
 * Event tracking
 */
export interface GAEvent {
    action: string;
    category: string;
    label?: string;
    value?: number;
}

export const event = ({ action, category, label, value }: GAEvent) => {
    if (!isGAEnabled()) return;

    const eventParams: Record<string, string | number> = {
        event_category: category,
    };

    if (label !== undefined) {
        eventParams.event_label = label;
    }

    if (value !== undefined) {
        eventParams.value = value;
    }

    window.gtag?.('event', action, eventParams);
};

/**
 * User properties
 */
export const setUserProperties = (properties: Record<string, string | number | boolean>) => {
    if (!isGAEnabled()) return;

    window.gtag('set', 'user_properties', properties);
};

/**
 * Custom events for AI Music Platform
 */
export const GAEvents = {
    // Audio Processing Events
    audioUpload: (fileSize: number, format: string) => {
        event({
            action: 'audio_upload',
            category: 'Audio Processing',
            label: format,
            value: fileSize,
        });
    },

    audioProcessingStart: (processingType: string) => {
        event({
            action: 'processing_start',
            category: 'Audio Processing',
            label: processingType,
        });
    },

    audioProcessingComplete: (processingTime: number) => {
        event({
            action: 'processing_complete',
            category: 'Audio Processing',
            value: processingTime,
        });
    },

    audioDownload: (stemType: string) => {
        event({
            action: 'stem_download',
            category: 'Audio Processing',
            label: stemType,
        });
    },

    // User Engagement Events
    demoRequest: () => {
        event({
            action: 'demo_request',
            category: 'Engagement',
            label: 'Demo Request Form',
        });
    },

    contactForm: (subject: string) => {
        event({
            action: 'contact_form',
            category: 'Engagement',
            label: subject,
        });
    },

    signup: (method: string) => {
        event({
            action: 'sign_up',
            category: 'User',
            label: method,
        });
    },

    login: (method: string) => {
        event({
            action: 'login',
            category: 'User',
            label: method,
        });
    },

    // Feature Usage Events
    featureUsed: (featureName: string) => {
        event({
            action: 'feature_used',
            category: 'Features',
            label: featureName,
        });
    },

    // Error Events
    error: (errorType: string, errorMessage: string) => {
        event({
            action: 'error',
            category: 'Errors',
            label: `${errorType}: ${errorMessage}`,
        });
    },

    // Conversion Events
    conversion: (conversionType: string, value?: number) => {
        event({
            action: 'conversion',
            category: 'Conversions',
            label: conversionType,
            value: value,
        });
    },
} as const;

// E-commerce item type
interface EcommerceItem {
    item_id: string;
    item_name: string;
    category?: string;
    quantity?: number;
    price?: number;
}

/**
 * E-commerce tracking (for future use)
 */
export const ecommerce = {
    purchase: (transactionId: string, value: number, items: EcommerceItem[]) => {
        if (!isGAEnabled()) return;

        window.gtag('event', 'purchase', {
            transaction_id: transactionId,
            value: value,
            currency: 'USD',
            items: items,
        });
    },

    addToCart: (item: EcommerceItem) => {
        if (!isGAEnabled()) return;

        window.gtag('event', 'add_to_cart', {
            items: [item],
        });
    },
};
