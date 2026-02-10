/**
 * User Analytics Tracking
 * 
 * Track user behavior, sessions, and engagement metrics
 * Privacy-compliant user analytics
 */

// Type definition for window globals
declare global {
    interface Window {
        gtag?: (command: string, eventName: string, params?: Record<string, any>) => void;
    }
}

/**
 * User session tracking
 */
export interface UserSession {
    sessionId: string;
    userId?: string;
    startTime: number;
    lastActivity: number;
    pageViews: number;
    events: string[];
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = sessionStorage.getItem('session_id');

    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('session_id', sessionId);
    }

    return sessionId;
}

/**
 * Track page view
 */
export function trackPageView(url: string) {
    const sessionId = getSessionId();

    // Update session
    const session: UserSession = {
        sessionId,
        startTime: Date.now(),
        lastActivity: Date.now(),
        pageViews: 1,
        events: [],
    };

    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
            page_path: url,
            session_id: sessionId,
        });
    }

    // TODO: Send to custom analytics endpoint
    // fetch('/api/analytics/pageview', {
    //   method: 'POST',
    //   body: JSON.stringify({ url, sessionId, timestamp: Date.now() }),
    // });
}

/**
 * Track user action
 */
export function trackUserAction(
    action: string,
    properties?: Record<string, string | number | boolean>
) {
    const sessionId = getSessionId();

    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            ...properties,
            session_id: sessionId,
        });
    }

    // TODO: Send to custom analytics endpoint
    // fetch('/api/analytics/action', {
    //   method: 'POST',
    //   body: JSON.stringify({ action, properties, sessionId, timestamp: Date.now() }),
    // });
}

/**
 * Track time on page
 */
export function trackTimeOnPage() {
    if (typeof window === 'undefined') return;

    const startTime = Date.now();

    const sendTimeOnPage = () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000); // seconds

        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'time_on_page', {
                value: timeOnPage,
                page_path: window.location.pathname,
            });
        }
    };

    // Send on page unload
    window.addEventListener('beforeunload', sendTimeOnPage);

    // Send every 30 seconds for long sessions
    const interval = setInterval(() => {
        sendTimeOnPage();
    }, 30000);

    // Cleanup
    return () => {
        clearInterval(interval);
        window.removeEventListener('beforeunload', sendTimeOnPage);
    };
}

/**
 * Track scroll depth
 */
export function trackScrollDepth() {
    if (typeof window === 'undefined') return;

    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];
    const reached = new Set<number>();

    const handleScroll = () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        maxScroll = Math.max(maxScroll, scrollPercent);

        milestones.forEach((milestone) => {
            if (scrollPercent >= milestone && !reached.has(milestone)) {
                reached.add(milestone);

                if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'scroll_depth', {
                        value: milestone,
                        page_path: window.location.pathname,
                    });
                }
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
}

/**
 * Track click events
 */
export function trackClicks(selector: string, eventName: string) {
    if (typeof window === 'undefined') return;

    const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        if (target.matches(selector)) {
            trackUserAction(eventName, {
                element: target.tagName,
                text: target.textContent?.substring(0, 50),
                href: target.getAttribute('href'),
            });
        }
    };

    document.addEventListener('click', handleClick);

    return () => {
        document.removeEventListener('click', handleClick);
    };
}

/**
 * Track form submissions
 */
export function trackFormSubmission(formId: string) {
    if (typeof window === 'undefined') return;

    const form = document.getElementById(formId);

    if (!form) return;

    const handleSubmit = (event: Event) => {
        trackUserAction('form_submission', {
            form_id: formId,
            form_name: (form as HTMLFormElement).name,
        });
    };

    form.addEventListener('submit', handleSubmit);

    return () => {
        form.removeEventListener('submit', handleSubmit);
    };
}

/**
 * User engagement score
 */
export function calculateEngagementScore(): number {
    const sessionId = getSessionId();
    const session = sessionStorage.getItem(`session_${sessionId}`);

    if (!session) return 0;

    try {
        const data = JSON.parse(session);

        // Simple engagement score calculation
        // Adjust weights as needed
        const score =
            (data.pageViews || 0) * 10 +
            (data.events?.length || 0) * 5 +
            Math.min((data.lastActivity - data.startTime) / 60000, 10) * 2; // time in minutes, capped at 10

        return Math.round(score);
    } catch (error) {
        console.error('Failed to parse session data for engagement calculation:', error);
        return 0;
    }
}
