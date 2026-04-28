/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { useFieldMetadata } from "../hooks/useFieldMetadata";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/shadcn/components/ui";
import { ValueInput } from "./ValueInput";
import { Button } from "@/shadcn/components/ui/button";
import { Trash2 } from "lucide-react";
import { getComparisonLabel } from "../utils";
import { ConditionalRuleType, FieldInfoType } from "../types";

export const RuleRow: React.FC<{
    rule: ConditionalRuleType;
    index: number;
    availableFields: FieldInfoType[];
    onUpdate: (index: number, updates: Partial<ConditionalRuleType>) => void;
    onDelete: (index: number) => void;
}> = ({ rule, index, availableFields, onUpdate, onDelete }) => {
    const { options, comparisonOperators } = useFieldMetadata(rule.field);

    return (
        <div className="grid grid-cols-[140px_140px_140px_40px] gap-2 px-3 py-2 items-center">
            {/* Field Select */}
            <Select
                value={rule.field}
                onValueChange={(value) =>
                    onUpdate(index, { field: value, value: "" })
                }
            >
                <SelectTrigger className="h-9! rounded! border border-gray-300 text-sm w-full">
                    <SelectValue
                        placeholder={__("Select Field", "optiontics")}
                    />
                </SelectTrigger>
                <SelectContent>
                    {availableFields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                            {field.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Comparison Select */}
            <Select
                value={rule.compare ? rule.compare : ""}
                onValueChange={(value) => onUpdate(index, { compare: value })}
            >
                <SelectTrigger className="h-9! rounded! border border-gray-300 text-sm w-full">
                    <SelectValue
                        placeholder={__("Select Comparison", "optiontics")}
                    />
                </SelectTrigger>
                <SelectContent>
                    {comparisonOperators.map((operator) => (
                        <SelectItem key={operator} value={operator || ""}>
                            {getComparisonLabel(operator)}
                        </SelectItem>
                    ))}
                    {comparisonOperators.length === 0 && (
                        <p className="text-base text-gray-500 py-2 my-0!">
                            {__("Select a field first", "optiontics")}
                        </p>
                    )}
                </SelectContent>
            </Select>

            {/* Value Input */}
            <ValueInput
                rule={rule}
                value={rule.value}
                options={options}
                onChange={(value) => onUpdate(index, { value: value as string })}
            />

            {/* Delete Button */}
            <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onDelete(index)}
            >
                <Trash2 className="w-4 h-4 text-gray-400" />
            </Button>
        </div>
    );
};
