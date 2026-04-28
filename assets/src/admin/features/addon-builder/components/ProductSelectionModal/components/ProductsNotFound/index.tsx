/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { ReactElement } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { Button } from "@/shadcn/components/ui/button";
import { InfoAlertIcon } from "@/common/icons";

interface ProductsNotFoundProps {
    onAddProduct?: () => void;
    showInfo?: boolean;
    infoMessage?: string;
}

/**
 * ProductsNotFound Component
 *
 * Displays an empty state when no products are found.
 * Matches the design specification with light blue background and border.
 * Reusable component for empty states in product-related contexts.
 */
export default function ProductsNotFound({
    showInfo = true,
    infoMessage,
}: ProductsNotFoundProps): ReactElement {

    const handleAddProduct = () => {
        const adminUrl = (window as any).optiontics?.admin_url || "";
        window.location.href = `${adminUrl}post-new.php?post_type=product`;
    };

    return (
        <div className="space-y-4">
            {/* Main Empty State Panel */}
            <div className="border border-[#D0E0F7] bg-[#F0F7FF] rounded-md p-8 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {__("No products found", "optiontics")}
                </h3>
                <Button
                    onClick={handleAddProduct}
                    variant="default"
                >
                    {__("Add your first product", "optiontics")}
                </Button>
            </div>

            {/* Informational Footer */}
            {showInfo && (
                <div className="flex items-center gap-1 mb-4">
                    <InfoAlertIcon />
                    <p className="text-sm text-gray-700 m-0!">
                        {infoMessage ||
                            __(
                                "Create a custom addon or fields, validation rules & styling preferences.",
                                "optiontics",
                            )}
                    </p>
                </div>
            )}
        </div>
    );
}

