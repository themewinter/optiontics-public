/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { ReactElement } from "@wordpress/element";
import { getCurrencySymbolHtml } from "@/common/components/price";

export default function PriceTypeOptionHeader(): ReactElement {
    const symbolHtml = getCurrencySymbolHtml();

    return (
        <div className="grid grid-cols-[250px_80px_80px] gap-2 items-center mb-2 px-2 py-1 border-b border-gray-300 bg-gray-100 rounded-t-lg! opt-price-type-option-header">
            <p className="text-xs font-semibold text-gray-700 w-24">
                {__("Price Type", "optiontics")}
            </p>
            <p className="text-xs font-semibold text-gray-700 w-20">
                {__(`Regular `, "optiontics")} {symbolHtml}
            </p>
            <p className="text-xs font-semibold text-gray-700 w-18">
                {__(`Sales `, "optiontics")} {symbolHtml}
            </p>
        </div>
    );
}
