/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select";
import {
    MultiSelect,
    MultiSelectTrigger,
    MultiSelectValue,
    MultiSelectContent,
    MultiSelectItem,
} from "@/shadcn/components/ui/multi-select";
import { ConditionalRuleType } from "../types";

export const ValueInput: React.FC<{
    rule: ConditionalRuleType;
    value: string | string[];
    options: string[];
    onChange: (value: string | string[]) => void;
}> = ({ rule, value, options, onChange }) => {
    const isMultiSelect = rule.compare === "in" || rule.compare === "not_in";

    // Normalize value: handle both string and array types
    const normalizeValue = (val: string | string[]): { stringValue: string; arrayValue: string[] } => {
        if (Array.isArray(val)) {
            return {
                stringValue: val.join(","),
                arrayValue: val.filter(Boolean),
            };
        }
        if (typeof val === "string") {
            return {
                stringValue: val,
                arrayValue: val ? val.split(",").map((v) => v.trim()).filter(Boolean) : [],
            };
        }
        return {
            stringValue: "",
            arrayValue: [],
        };
    };

    const { stringValue, arrayValue } = normalizeValue(value);

    // Handle multi-select value change
    const handleMultiSelectChange = (values: string[]) => {
        onChange(values);
    };

    // Handle single select value change
    const handleSelectChange = (val: string) => {
        onChange(val);
    };

    // Handle text input change
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    if (options.length > 0) {
        if (isMultiSelect) {
            return (
                <MultiSelect
                    values={arrayValue}
                    onValuesChange={handleMultiSelectChange}
                >
                    <MultiSelectTrigger className="h-9! rounded! border border-gray-300 text-sm w-full">
                        <MultiSelectValue
                            placeholder={__("Select Values", "optiontics")}
                            overflowBehavior="wrap-when-open"
                        />
                    </MultiSelectTrigger>
                    <MultiSelectContent search={false}>
                        {options.map((option) => (
                            <MultiSelectItem
                                key={option}
                                value={option}
                                badgeLabel={option}
                            >
                                {option}
                            </MultiSelectItem>
                        ))}
                    </MultiSelectContent>
                </MultiSelect>
            );
        }

        return (
            <Select value={stringValue} onValueChange={handleSelectChange}>
                <SelectTrigger className="h-9! rounded! border border-gray-300 text-sm w-full">
                    <SelectValue placeholder={__("Select Value", "optiontics")} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    return (
        <input
            type="text"
            value={stringValue}
            onChange={handleTextChange}
            placeholder={__("Enter value", "optiontics")}
            className="h-9! px-2 rounded! border border-gray-300! text-sm"
        />
    );
};
