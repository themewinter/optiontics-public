/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { Image as ImageIcon, X } from "lucide-react";
import {
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/components/ui";
import { Button } from "@/shadcn/components/ui/button";
import { If } from "@/common/components";
import { Option } from "../options";
import { priceTypeOptions } from "../../../constant";
import { ReactElement } from "@wordpress/element";

interface Props {
    option: Option;
    index: number;
    updateOption: (index: number, field: keyof Option, value: any) => void;
    uploadImage: (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        index: number,
    ) => void;
    removeImage: (index: number) => void;
    updateOptionFields: (index: number, updates: Partial<Option>) => void;
}

export default function SwitchFieldOptionRow({
    option,
    index,
    updateOption,
    uploadImage,
    removeImage,
    updateOptionFields,
}: Props): ReactElement {
    const handleOnValueChange = (value: string) => {
        if (value === "no_cost") {
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
            className={`grid grid-cols-[150px_60px_100px_80px_80px] gap-1 items-center p-2 rounded-md transition-colors `}
        >
            {/* Title */}
            <Input
                value={option.value}
                onChange={(e) => updateOption(index, "value", e.target.value)}
                className="h-9! text-sm w-full rounded! border border-gray-300!"
            />

            {/* Image */}
            <div className="flex items-center justify-center w-auto">
                <If condition={option.image}>
                    <div className="relative">
                        <img
                            src={option.image}
                            alt={option.value}
                            className="rounded-md size-10"
                        />
                        <X
                            className="w-4 h-4 cursor-pointer absolute top-0 right-0 bg-red-400 text-white rounded-full p-0.5"
                            onClick={() => removeImage(index)}
                        />
                    </div>
                </If>
                <If condition={!option.image}>
                    <Button
                        size="icon"
                        variant="outline"
                        className="w-auto h-10 rounded"
                        onClick={(e) => uploadImage(e, index)}
                    >
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                    </Button>
                </If>
            </div>

            {/* Price Type */}
            <Select
                value={option.type}
                onValueChange={(value) => handleOnValueChange(value)}
            >
                <SelectTrigger className="text-sm rounded! border border-gray-300 w-full h-9!">
                    <SelectValue
                        placeholder={__("Select a price type", "optiontics")}
                        className="py-0! h-9!"
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
                onChange={(e) => updateOption(index, "regular", e.target.value)}
                className="h-9 text-sm w-16 rounded!"
                placeholder="0"
                min={0}
                readOnly={option.type === "no_cost"}
                type={option.type === "no_cost" ? "text" : "number"}
            />

            {/* Sale */}
            <Input
                value={option.type === "no_cost" ? "" : option.sale}
                onChange={(e) => updateOption(index, "sale", e.target.value)}
                className="h-9 text-sm w-16 rounded!"
                placeholder="0"
                min={0}
                readOnly={option.type === "no_cost"}
                type={option.type === "no_cost" ? "text" : "number"}
            />
        </div>
    );
}
