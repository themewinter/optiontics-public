/**
 * Wordpress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { ChangeEvent, useState } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { Input } from "@/shadcn/components/ui";
import { ControlGeneratorProps } from "../../types";

export default function QuantityFieldsControl({
    minLabel = __("Minimum Quantity", "optiontics"),
    maxLabel = __("Maximum Quantity", "optiontics"),
    attributes,
    setAttribute,
}: {
    minLabel?: string;
    maxLabel?: string;
} & ControlGeneratorProps<any>): React.ReactElement {
    const [minError, setMinError] = useState<string | null>(null);
    const [maxError, setMaxError] = useState<string | null>(null);

    // Defaults
    const min = attributes.min != null ? Number(attributes.min) : 1;
    const max = attributes.max != null ? Number(attributes.max) : 100;

    // Handlers with validation
    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (isNaN(value) || value < 1) {
            setMinError(__("Minimum must be at least 1", "optiontics"));
            setAttribute("min", 1);
        } else if (value > max) {
            setMinError(__("Minimum cannot exceed maximum", "optiontics"));
            setAttribute("min", max);
        } else {
            setMinError(null);
            setAttribute("min", value);
        }
    };

    const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (isNaN(value) || value < 1) {
            setMaxError(__("Maximum must be at least 1", "optiontics"));
            setAttribute("max", 1);
        } else if (value < min) {
            setMaxError(__("Maximum cannot be less than minimum", "optiontics"));
            setAttribute("max", min);
        } else {
            setMaxError(null);
            setAttribute("max", value);
        }
    };

    return (
        <div className="flex gap-2 w-full">
            <div className="flex flex-col gap-2 w-full">
                <p className="text-sm font-medium text-gray-700 my-1!">{minLabel}</p>
                <Input
                    id="min"
                    type="number"
                    className="w-full p-2 rounded! border border-gray-300! text-sm h-9!"
                    value={min}
                    min={1}
                    max={max}
                    onChange={handleMinChange}
                />
                {minError && (
                    <span className="text-xs text-red-500">{minError}</span>
                )}
            </div>
            <div className="flex flex-col gap-2 w-full">
                <p className="text-sm font-medium text-gray-700 my-1!">{maxLabel}</p>
                <Input
                    id="max"
                    type="number"
                    className="w-full p-2 rounded! border border-gray-300! text-sm h-9!"
                    value={max}
                    min={min}
                    onChange={handleMaxChange}
                />
                {maxError && (
                    <span className="text-xs text-red-500">{maxError}</span>
                )}
            </div>
        </div>
    );
}