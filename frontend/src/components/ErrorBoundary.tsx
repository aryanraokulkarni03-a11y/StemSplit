'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4 text-red-500">Something went wrong</h1>
                        <p className="text-lg text-muted-foreground mb-6">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children || this.props.fallback;
    }
}

export default ErrorBoundary;