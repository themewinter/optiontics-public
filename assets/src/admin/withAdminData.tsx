/**
 * WordPress Dependencies
 */
import { ComponentType, StrictMode, Suspense } from "@wordpress/element";

/**
 * Internal and Tailwind dependencies
 */
import { FullscreenSkeleton } from "@/shadcn/components/ui/skeleton";
import { Toaster } from "@/shadcn/components/ui/sonner";
/**
 * Higher Order Component (HOC) to provide admin data and state management.
 *
 * @param WrappedComponent - The component to wrap and provide data to.
 * @returns React Component with admin features.
 */
const withAdminData = <P extends object>(
    WrappedComponent: ComponentType<P>,
) => {
    const EnhancedComponent = (props: P) => {
        return (
            <StrictMode>
                <Suspense fallback={<FullscreenSkeleton />}>
                    <Toaster richColors position="bottom-right" />
                    <WrappedComponent {...props} />
                </Suspense>
            </StrictMode>
        );
    };

    return EnhancedComponent;
};

export default withAdminData;
