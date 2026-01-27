import React from 'react';
import { Button } from './button';
import { logger } from '../../services/logger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        logger.error('Uncaught Error in Component:', { error, errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                We encountered an unexpected error. Our team has been notified.
                            </p>
                        </div>

                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-left overflow-auto max-h-40 text-xs font-mono text-red-500 border border-red-100 dark:border-red-900/50">
                            {this.state.error && this.state.error.toString()}
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Button onClick={this.handleReload} variant="default">
                                Reload Page
                            </Button>
                            <Button onClick={() => window.location.href = '/'} variant="outline">
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
