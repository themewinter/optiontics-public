/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

export const RulesTableHeader: React.FC = () => (
    <div className="grid grid-cols-[140px_140px_140px_40px] gap-2 bg-gray-100 px-3 py-2 border-b border-gray-200">
        <div className="text-xs font-medium text-gray-700">
            {__("Field", "optiontics")}
        </div>
        <div className="text-xs font-medium text-gray-700">
            {__("Choose Conditional type", "optiontics")}
        </div>
        <div className="text-xs font-medium text-gray-700">
            {__("Value", "optiontics")}
        </div>
        <div className="w-8"></div>
    </div>
);
