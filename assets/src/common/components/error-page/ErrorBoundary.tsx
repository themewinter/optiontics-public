/**
 * WordPress dependencies
 */
import { Component, ReactNode } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { ErrorPage } from "@/common/components/error-page";

interface ErrorBoundaryState {
    hasError: boolean;
}

interface ErrorBoundaryProps {
    children: ReactNode;
}

class ErrorBoundary extends (Component as unknown as typeof Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
>) {
    state = {
        hasError: false,
    };

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorPage />;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
