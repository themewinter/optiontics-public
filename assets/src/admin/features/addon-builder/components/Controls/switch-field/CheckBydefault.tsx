/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { OptionSwitch } from "../options-switch";
import { Control, ControlGeneratorProps } from "../../../types";
import { Option } from "../options";

export default function CheckBydefaultControl({
    attrKey,
    control,
    attributes,
    setAttribute,
}: ControlGeneratorProps<any> & { control: Control }): React.ReactElement {
    return (
        <OptionSwitch
            label={control?.label || __("Check by default", "optiontics")}
            checked={Boolean(
                attributes[attrKey as keyof typeof attributes][0]?.default,
            )}
            onChange={(checked) => {
                const updatedOptions = attributes[
                    attrKey as keyof typeof attributes
                ].map((option: Option) => ({
                    ...option,
                    default: Boolean(checked),
                }));
                setAttribute(attrKey as string, updatedOptions);
            }}
        />
    );
}
