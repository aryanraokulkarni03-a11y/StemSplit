/**
 * Unit Tests for Analytics
 */

import {
    pageview,
    event,
    setUserProperties,
    GAEvents,
    isGAEnabled,
} from '../analytics';

describe('Analytics', () => {
    beforeEach(() => {
        // Mock gtag
        (window as any).gtag = jest.fn();
    });

    afterEach(() => {
        delete (window as any).gtag;
    });

    describe('isGAEnabled', () => {
        it('should return true when GA_MEASUREMENT_ID is set', () => {
            const originalEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
            process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123';

            expect(isGAEnabled()).toBe(true);

            process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalEnv;
        });
    });

    describe('pageview', () => {
        it('should call gtag with correct parameters', () => {
            pageview('/test-page');

            expect((window as any).gtag).toHaveBeenCalledWith(
                'config',
                expect.any(String),
                { page_path: '/test-page' }
            );
        });
    });

    describe('event', () => {
        it('should track event with all parameters', () => {
            event({
                action: 'click',
                category: 'Button',
                label: 'Submit',
                value: 1,
            });

            expect((window as any).gtag).toHaveBeenCalledWith('event', 'click', {
                event_category: 'Button',
                event_label: 'Submit',
                value: 1,
            });
        });

        it('should track event without optional parameters', () => {
            event({
                action: 'view',
                category: 'Page',
            });

            expect((window as any).gtag).toHaveBeenCalledWith('event', 'view', {
                event_category: 'Page',
                event_label: undefined,
                value: undefined,
            });
        });
    });

    describe('setUserProperties', () => {
        it('should set user properties', () => {
            setUserProperties({ plan: 'premium', role: 'admin' });

            expect((window as any).gtag).toHaveBeenCalledWith('set', 'user_properties', {
                plan: 'premium',
                role: 'admin',
            });
        });
    });

    describe('GAEvents', () => {
        it('should track audio upload', () => {
            GAEvents.audioUpload(1024000, 'mp3');

            expect((window as any).gtag).toHaveBeenCalledWith('event', 'audio_upload', {
                event_category: 'Audio Processing',
                event_label: 'mp3',
                value: 1024000,
            });
        });

        it('should track audio processing start', () => {
            GAEvents.audioProcessingStart('stem-separation');

            expect((window as any).gtag).toHaveBeenCalledWith(
                'event',
                'processing_start',
                expect.objectContaining({
                    event_category: 'Audio Processing',
                    event_label: 'stem-separation',
                })
            );
        });

        it('should track demo request', () => {
            GAEvents.demoRequest();

            expect((window as any).gtag).toHaveBeenCalledWith(
                'event',
                'demo_request',
                expect.objectContaining({
                    event_category: 'Engagement',
                })
            );
        });

        it('should track signup', () => {
            GAEvents.signup('google');

            expect((window as any).gtag).toHaveBeenCalledWith(
                'event',
                'sign_up',
                expect.objectContaining({
                    event_category: 'User',
                    event_label: 'google',
                })
            );
        });

        it('should track errors', () => {
            GAEvents.error('TypeError', 'Cannot read property');

            expect((window as any).gtag).toHaveBeenCalledWith(
                'event',
                'error',
                expect.objectContaining({
                    event_category: 'Errors',
                })
            );
        });

        it('should track conversions', () => {
            GAEvents.conversion('purchase', 99.99);

            expect((window as any).gtag).toHaveBeenCalledWith(
                'event',
                'conversion',
                expect.objectContaining({
                    event_category: 'Conversions',
                    value: 99.99,
                })
            );
        });
    });
});
