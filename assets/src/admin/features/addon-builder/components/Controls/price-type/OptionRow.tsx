/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { ReactElement } from "@wordpress/element";

/**
 * External dependencies
 */
import {
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/components/ui";
import { Option } from "../options";
import { priceTypeOptions } from "../../../constant";

interface Props {
    option: Option;
    index: number;
    updateOption: (index: number, field: keyof Option, value: any) => void;
    updateOptionFields: (index: number, updates: Partial<Option>) => void;
}

export default function PriceTypeOptionRow({
    index,
    option,
    updateOption,
    updateOptionFields,
}: Props): ReactElement {
    const handleOnValueChange = (value: string) => {
        if (value === "no_cost") {
            // Update all fields at once to avoid stale state issues
            updateOptionFields(index, {
                type: value,
                regular: "Free",
                sale: "",
            });
        } else {
            updateOption(index, "type" as keyof Option, value);
        }
    };

    return (
        <div
            className={`grid grid-cols-[250px_80px_80px] gap-2 items-center p-2 rounded-md transition-colors opt-price-type-option-row`}
        >
            {/* Price Type */}
            <Select
                value={option.type}
                onValueChange={(value) => handleOnValueChange(value)}
            >
                <SelectTrigger className="rounded! border! border-gray-300! text-sm w-full h-9!">
                    <SelectValue
                        placeholder={__("Select a price type", "optiontics")}
                    />
                </SelectTrigger>
                <SelectContent>
                    {priceTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Regular */}
            <Input
                value={option.type === "no_cost" ? "Free" : option.regular}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (option.type !== "no_cost") {
                        updateOption(
                            index,
                            "regular" as keyof Option,
                            e.target.value,
                        );
                    }
                }}
                className="h-9! text-sm w-16 rounded! border! border-gray-300!"
                placeholder="0"
                min={0}
                readOnly={option.type === "no_cost"}
                type={option.type === "no_cost" ? "text" : "number"}
            />

            {/* Sale */}
            <Input
                value={option.type === "no_cost" ? "" : option.sale}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (option.type !== "no_cost") {
                        updateOption(index, "sale" as keyof Option, e.target.value);
                    }
                }}
                className="h-9! text-sm w-16 rounded! border! border-gray-300!"
                placeholder="0"
                min={0}
                readOnly={option.type === "no_cost"}
                type={option.type === "no_cost" ? "text" : "number"}
            />
        </div>
    );
}
