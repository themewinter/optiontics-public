/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

export const EmptyFieldsMessage: React.FC = () => (
    <p className="text-sm text-gray-500 text-center">
        {__("No other fields available for conditional logic.", "optiontics")}
    </p>
);