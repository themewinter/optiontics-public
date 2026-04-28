import { Control, ControlGeneratorProps } from "../../types";

export default function TextControl({
    attrKey,
    control,
    attributes,
    setAttribute,
}: ControlGeneratorProps<any> & { control: Control }): React.ReactElement {
    return (
        <div>
            <label>{control.label}</label>
            <input
                type="text"
				value={ attributes[ attrKey as keyof typeof attributes ] || "" }
                
                onChange={(e) =>
                    setAttribute(attrKey as string, e.target.value as string)
                }
            />
        </div>
    );
}
