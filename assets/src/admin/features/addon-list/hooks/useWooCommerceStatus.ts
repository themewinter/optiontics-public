/**
 * WordPress dependencies
 */
import { useMemo } from "@wordpress/element";

export const useWooCommerceStatus = (): boolean => {

    // Check if WooCommerce status is available in settings
    const wcStatus = useMemo(() => {
        if ((window as any).optiontics?.wc_active) { return true }

        // Fallback: Check if WooCommerce class exists globally
        if (typeof window !== "undefined") {
            // Check if WooCommerce is available via localized data
            const adminData = (window as any).optiontics;
            if (adminData?.wc_active !== undefined) {
                return adminData.wc_active === true;
            }
        }

        // Default to false if we can't determine status
        return false;
    }, []);

    return wcStatus;
};

