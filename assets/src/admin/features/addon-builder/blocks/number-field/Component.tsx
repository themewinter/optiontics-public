/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { useNode } from "@craftjs/core";

/**
 * Internal dependencies
 */
import { Input } from "@/shadcn/components/ui";
import { If } from "@/common/components/If";
import { BlockToolbox } from "../../components/BlockToolbox";
import { cn } from "@/shadcn/lib/utils";
import { OptionPrice } from "../../components/OptionPrice";
import { calculatePercentage } from "../../utils";

interface Option {
    type?: "fixed" | "percentage" | "no_cost";
    regular: number | string;
    sale?: number | string;
    min?: number;
    max?: number;
}

interface ComponentProps {
    label?: string;
    desc?: string;
    required?: boolean;
    options: Option[];
    placeholder?: string;
    pricePosition?: "with_title" | "with_option";
    min?: number;
    max?: number;
}

/**
 * Number Field Component
 *
 * Renders a labeled input field with optional description and price display.
 * Supports showing prices either beside the label ("with_title") or beside the input field ("with_option").
 */
export default function Component(props: ComponentProps) {
    const {
        label,
        desc,
        required,
        options,
        placeholder,
        pricePosition = "with_option",
        min = 0,
        max = 100,
    } = props;

    const { connectors, isActive } = useNode((node) => ({
        isActive: node.events.selected,
    }));

    // Extract the first option for price display
    const firstOption = options?.[0];

    /**
     * Render a price display element using shared OptionPrice component.
     */
    const renderPrice = () => {
        if (!firstOption || !firstOption.regular) return null;
        return (
            <span className="text-sm text-gray-500 ml-2">
                <OptionPrice 
                    option={firstOption} 
                    calculatePercentage={calculatePercentage} 
                />
            </span>
        );
    };

    return (
        <div
            ref={(ref: HTMLElement | null) => ref && connectors.connect(ref)}
            className={cn("flex flex-col gap-2 relative border border-dashed border-transparent hover:border-gray-400 transition-all duration-300 rounded! p-1", isActive && "border-solid border-gray-400",
            )}
        >
            <BlockToolbox />
            {/* Label + Price (if pricePosition === "with_title") */}
            <If condition={!!label}>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                    {label}
                    <If condition={pricePosition === "with_title"}>
                        {renderPrice()}
                    </If>
                    <If condition={!!required}>
                        <span className="text-red-500 ml-1">*</span>
                    </If>
                </label>
            </If>

            {/* Description text */}
            <If condition={!!desc}>
                <p className="text-sm text-gray-500 my-0!">{desc}</p>
            </If>

            {/* Input field with optional price display (if pricePosition === "with_option") */}
            <If condition={pricePosition === "with_option"}>
                <div className="flex items-center gap-2 w-full">
                    <Input
                        type="number"
                        min={min}
                        max={max}
                        placeholder={placeholder}
                        className="w-full p-2 rounded! border! border-gray-300! text-sm h-9!"
                    />
                    {renderPrice()}
                </div>
            </If>

            {/* Input field without inline price (for "with_title") */}
            <If condition={pricePosition === "with_title"}>
                <Input
                    type="number"
                    min={min}
                    max={max}
                    placeholder={placeholder}
                    className="w-full p-2 rounded! border border-gray-300! text-sm h-9!"
                />
            </If>
        </div>
    );
}
