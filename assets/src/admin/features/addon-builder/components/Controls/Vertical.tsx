/**
 * Internal dependencies
 */
import { OptionSwitch } from "./options-switch";
import { Control, ControlGeneratorProps } from "../../types";

export default function VerticalControl({
    attrKey,
    control,
    attributes,
    setAttribute,
}: ControlGeneratorProps<any> & { control: Control }): React.ReactElement {
    return (
        <OptionSwitch
            label={control.label as string}
            description={control.description as string | undefined}
            checked={Boolean(attributes[attrKey as keyof typeof attributes])}
            onChange={(checked) => setAttribute(attrKey as string, Boolean(checked))}
        />
    );
}
