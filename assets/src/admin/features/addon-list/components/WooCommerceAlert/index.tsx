/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { ReactElement } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { Button } from "@/shadcn/components/ui";

interface WooCommerceAlertProps {
    isWooCommerceActive: boolean;
}

/**
 * WooCommerce Alert Component
 *
 * Displays an alert message when WooCommerce is not active.
 * Matches the design specification with light blue border and background.
 */
export default function WooCommerceAlert({
    isWooCommerceActive,
}: WooCommerceAlertProps): ReactElement | null {
    // Don't render if WooCommerce is active
    if (isWooCommerceActive) {
        return null;
    }

    const handleActivateClick = () => {
        // Redirect to plugins page to activate WooCommerce
        // WordPress requires a specific nonce for plugin activation
        const adminUrl = (window as any).optiontics?.admin_url || "";
        // const pluginSlug = "woocommerce/woocommerce.php";

        // Construct the activation URL
        // Note: The nonce will be generated server-side when the page loads
        // const activateUrl = `${adminUrl}plugins.php?action=activate&plugin=${encodeURIComponent(
        //     pluginSlug,
        // )}&plugin_status=all&paged=1&s&_wpnonce=${(window as any).optiontics?.nonce}`;
        const activateUrl = `${adminUrl}plugins.php`;
        window.location.href = activateUrl;
    };

    return (
        <div className="border border-[#1966FF] bg-[#EFF6FF] rounded-md p-6 flex items-center justify-between max-w-[1020px] mx-auto">
            <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-gray-800 m-0!">
                    {__("WooCommerce Not Active", "optiontics")}
                </h3>
                <p className="text-sm text-gray-700 m-0!">
                    {__(
                        "Please activate WooCommerce to enable product-related features.",
                        "optiontics",
                    )}
                </p>
            </div>
            <Button
                onClick={handleActivateClick}
                variant="default"
            >
                {__("Install & Activate", "optiontics")}
            </Button>
        </div>
    );
}
