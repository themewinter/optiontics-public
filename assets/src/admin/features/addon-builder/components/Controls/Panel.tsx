import ControlGenerator from ".";
import { Control, ControlGeneratorProps } from "../../types";

export default function PanelControl({
    control,
    attributes,
    setAttribute,
}: ControlGeneratorProps<any> & { control: Control }) {
    if (!control.children) {
        return null;
    }

    return (
        <>
            {control.label && (
                <h4 className="text-base font-medium text-gray-700 my-1!">
                    {control.label}
                </h4>
            )}
            <ControlGenerator
                controls={control.children}
                attributes={attributes}
                setAttribute={setAttribute}
            />
        </>
    );
}
