'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log to console (hook up Sentry in production)
        console.error('ErrorBoundary caught:', error, errorInfo);
        // TODO: Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Something went wrong</h2>
                        <p className="max-w-md text-sm text-muted-foreground">
                            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => this.setState({ hasError: false, error: null })}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                        <Button
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reload Page
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
