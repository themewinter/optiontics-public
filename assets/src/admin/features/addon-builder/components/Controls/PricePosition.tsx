/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Control, ControlGeneratorProps } from "../../types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/components/ui";

export default function PricePositionControl({
    attrKey,
    control,
    attributes,
    setAttribute,
}: ControlGeneratorProps<any> & { control: Control }): React.ReactElement {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700 my-1!">
                {control.label}
            </p>
            <Select
                value={
                    attributes[attrKey as keyof typeof attributes] ||
                    "with_title"
                }
                onValueChange={(value) => {
                    setAttribute(attrKey as string, value as string);
                }}
            >
                <SelectTrigger className="h-9! rounded! border border-gray-300 text-sm">
                    <SelectValue
                        placeholder={__("Select a position", "optiontics")}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="with_title">
                        {__("With Title", "optiontics")}
                    </SelectItem>
                    <SelectItem value="with_option">
                        {__("With option", "optiontics")}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
