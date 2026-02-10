/**
 * Error Tracking and Logging
 * 
 * Centralized error handling, logging, and reporting
 * Integrates with Sentry, LogRocket, or custom error tracking
 */

// Type definition for window globals
declare global {
    interface Window {
        gtag?: (command: 'config' | 'set' | 'event', targetId?: string, params?: Record<string, any>) => void;
    }
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
    DEBUG = 'debug',
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    FATAL = 'fatal',
}

/**
 * Error context
 */
export interface ErrorContext {
    user?: {
        id?: string;
        email?: string;
        name?: string;
    };
    request?: {
        url?: string;
        method?: string;
        headers?: Record<string, string>;
    };
    extra?: Record<string, string | number | boolean | object>;
}

/**
 * Log error to console (development)
 */
function logToConsole(
    error: Error,
    severity: ErrorSeverity,
    context?: ErrorContext
) {
    const logFn = severity === ErrorSeverity.FATAL || severity === ErrorSeverity.ERROR
        ? console.error
        : severity === ErrorSeverity.WARNING
            ? console.warn
            : console.log;

    logFn(`[${severity.toUpperCase()}]`, error.message, {
        error,
        context,
    });
}

/**
 * Send error to analytics
 */
function sendToAnalytics(
    error: Error,
    severity: ErrorSeverity,
    context?: ErrorContext
) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
            description: error.message,
            fatal: severity === ErrorSeverity.FATAL,
            ...(context?.extra && { ...context.extra }),
        });
    }
}

/**
 * Send error to external service (Sentry, LogRocket, etc.)
 */
function sendToExternalService(
    error: Error,
    severity: ErrorSeverity,
    context?: ErrorContext
) {
    // TODO: Integrate with Sentry
    // if (typeof window !== 'undefined' && (window as any).Sentry) {
    //   (window as any).Sentry.captureException(error, {
    //     level: severity,
    //     user: context?.user,
    //     extra: context?.extra,
    //   });
    // }

    // TODO: Integrate with LogRocket
    // if (typeof window !== 'undefined' && (window as any).LogRocket) {
    //   (window as any).LogRocket.captureException(error, {
    //     tags: { severity },
    //     extra: context,
    //   });
    // }
}

/**
 * Main error tracking function
 */
export function trackError(
    error: Error,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    context?: ErrorContext
) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        logToConsole(error, severity, context);
    }

    // Send to analytics
    sendToAnalytics(error, severity, context);

    // Send to external service
    sendToExternalService(error, severity, context);

    // Send to custom API endpoint
    if (severity === ErrorSeverity.FATAL || severity === ErrorSeverity.ERROR) {
        fetch('/api/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: error.message,
                stack: error.stack,
                severity,
                context,
                timestamp: new Date().toISOString(),
            }),
        }).catch((err) => {
            console.error('Failed to send error to API:', err);
        });
    }
}

/**
 * Error boundary helper
 */
export function handleComponentError(
    error: Error,
    errorInfo: { componentStack: string }
) {
    trackError(error, ErrorSeverity.ERROR, {
        extra: {
            componentStack: errorInfo.componentStack,
        },
    });
}

/**
 * API error handler
 */
export function handleAPIError(
    error: Error,
    endpoint: string,
    method: string
) {
    trackError(error, ErrorSeverity.ERROR, {
        request: {
            url: endpoint,
            method,
        },
    });
}

/**
 * Unhandled promise rejection handler
 */
if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
        trackError(
            new Error(event.reason),
            ErrorSeverity.ERROR,
            {
                extra: {
                    type: 'unhandledRejection',
                    promise: event.promise,
                },
            }
        );
    });
}

/**
 * Global error handler
 */
if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        trackError(
            event.error || new Error(event.message),
            ErrorSeverity.ERROR,
            {
                extra: {
                    type: 'globalError',
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                },
            }
        );
    });
}

/**
 * Custom logger
 */
export const logger = {
    debug: (message: string, context?: ErrorContext) => {
        trackError(new Error(message), ErrorSeverity.DEBUG, context);
    },

    info: (message: string, context?: ErrorContext) => {
        trackError(new Error(message), ErrorSeverity.INFO, context);
    },

    warning: (message: string, context?: ErrorContext) => {
        trackError(new Error(message), ErrorSeverity.WARNING, context);
    },

    error: (message: string, context?: ErrorContext) => {
        trackError(new Error(message), ErrorSeverity.ERROR, context);
    },

    fatal: (message: string, context?: ErrorContext) => {
        trackError(new Error(message), ErrorSeverity.FATAL, context);
    },
};
