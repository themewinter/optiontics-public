/**
 * Internal dependencies
 */
import { __ } from "@wordpress/i18n";
import { Input } from "@/shadcn/components/ui";
import { ControlGeneratorProps } from "../../../types";

/**
 * SwitchLabelControl
 *
 * Edits the visible label text of the single switch option (options[0].value).
 * Rendered in the Switch block settings panel below the Title/Description fields.
 */
export default function SwitchLabelControl({
    attributes,
    setAttribute,
}: ControlGeneratorProps<any>): React.ReactElement {
    const options = Array.isArray(attributes?.options) ? attributes.options : [];
    const value: string = options[0]?.value ?? "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = [...options];
        if (!updated[0]) return;
        updated[0] = { ...updated[0], value: e.target.value };
        setAttribute("options", updated);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <p className="text-sm font-medium text-gray-700 my-1!">
                {__("Switch Label", "optiontics")}
            </p>
            <Input
                type="text"
                className="w-full p-2 rounded! border border-gray-300! text-sm"
                value={value}
                onChange={handleChange}
                placeholder={__("Switch Option 1", "optiontics")}
            />
        </div>
    );
}
