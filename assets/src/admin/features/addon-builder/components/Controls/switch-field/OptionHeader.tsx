/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { ReactElement } from "@wordpress/element";
import { getCurrencySymbolHtml } from "@/common/components";

export default function SwitchFieldOptionHeader(): ReactElement {
    return (
        <div className="grid grid-cols-[150px_60px_100px_80px_80px] gap-1 items-center mb-2 px-2 py-1 border-b border-gray-300 bg-gray-100 rounded-t-lg!">
            <p className="text-xs font-semibold text-gray-700 w-20">
                {__("Title", "optiontics")}
            </p>
            <p className="text-xs font-semibold text-gray-700 text-center w-10">
                {__("Image", "optiontics")}
            </p>
            <p className="text-xs font-semibold text-gray-700 w-full">
                {__("Price Type", "optiontics")}
            </p>
            <p className="text-xs font-semibold text-gray-700 w-16">
                {__("Regular ", "optiontics")} {getCurrencySymbolHtml()}
            </p>
            <p className="text-xs font-semibold text-gray-700 w-16">
                {__("Sales ", "optiontics")} {getCurrencySymbolHtml()}
            </p>
        </div>
    );
}
