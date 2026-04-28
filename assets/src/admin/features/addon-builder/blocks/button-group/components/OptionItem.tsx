/**
 * External dependencies
 */
import { Trash2 } from "lucide-react";

/**
 * Internal dependencies
 */
import { Button } from "@/shadcn/components/ui/button";
import { cn } from "@/shadcn/lib/utils";
import { OptionPrice } from "../../../components/OptionPrice";
import { calculatePercentage } from "../../../utils";
import { Option } from "../../../components/Controls/options";

interface Props {
    option: Option;
    index: number;
    onSelect: (index: number) => void;
    onDelete: (index: number) => void;
}

export const OptionItem = ({ option, index, onSelect, onDelete }: Props) => (
    <div className="relative group">
        <Button
            type="button"
            variant={option.default ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(index)}
            className={cn(
                "h-10 rounded-md px-4 font-medium",
                option.default
                    ? "border border-primary"
                    : "bg-white text-gray-800",
            )}
        >
            <span>{option.value}</span>
            <span
                className={cn(
                    "ml-2 text-xs",
                    option.default ? "opacity-80" : "text-gray-500",
                )}
            >
                <OptionPrice
                    option={option}
                    calculatePercentage={calculatePercentage}
                />
            </span>
        </Button>

        <button
            type="button"
            aria-label="Delete option"
            onClick={() => onDelete(index)}
            className="absolute -right-2.5 -top-2.5 flex items-center justify-center bg-gray-100 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <Trash2 className="w-4 h-4 text-red-500" />
        </button>
    </div>
);
