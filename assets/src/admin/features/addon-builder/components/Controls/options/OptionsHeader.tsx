/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { ReactElement } from "@wordpress/element";

/**
 * Options header component for the options table.
 * Shared across all option-based blocks (Radio, Dropdown, etc.)
 */
export default function OptionsHeader(): ReactElement {
    return (
        <div
            className={`grid grid-cols-[40px_150px_120px_180px_60px] gap-1 items-center pb-2 rounded-t-lg! opt-options-header`}
        >
            <div></div>
            <p className="text-xs font-semibold text-gray-700 w-full mb-0!">
                {__("Title", "optiontics")}
            </p>
            <p className="text-xs font-semibold text-gray-700 w-full mb-0!">
                {__("Type", "optiontics")}
            </p>
            <p className="text-xs font-semibold text-gray-700 w-auto mb-0!">
                {__("Price ", "optiontics")}
            </p>
            <div></div>
        </div>
    );
}
