/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Select, SelectTrigger } from "@/shadcn/components/ui";
import {
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/shadcn/components/ui/select";
import { Control, ControlGeneratorProps } from "../../types";

export default function HeadingTagControl({
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
                value={attributes[attrKey as keyof typeof attributes] || ""}
                onValueChange={(value) =>
                    setAttribute(attrKey as string, value as string)
                }
            >
                <SelectTrigger className="w-full h-9! rounded! border border-gray-300! text-sm">
                    <SelectValue
                        placeholder={__("Select a tag", "optiontics")}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="h1">{__("H1", "optiontics")}</SelectItem>
                    <SelectItem value="h2">{__("H2", "optiontics")}</SelectItem>
                    <SelectItem value="h3">{__("H3", "optiontics")}</SelectItem>
                    <SelectItem value="h4">{__("H4", "optiontics")}</SelectItem>
                    <SelectItem value="h5">{__("H5", "optiontics")}</SelectItem>
                    <SelectItem value="h6">{__("H6", "optiontics")}</SelectItem>
                    <SelectItem value="span">
                        {__("Span", "optiontics")}
                    </SelectItem>
                    <SelectItem value="div">
                        {__("Div", "optiontics")}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
