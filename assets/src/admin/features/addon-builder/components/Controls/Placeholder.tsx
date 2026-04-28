/**
 * Internal dependencies
 */
import { Input } from "@/shadcn/components/ui";
import { Control, ControlGeneratorProps } from "../../types";

export default function PlaceholderControl({
    attrKey,
    control,
    attributes,
    setAttribute,
}: ControlGeneratorProps<any> & { control: Control }): React.ReactElement {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700 my-1!">{control.label}</p>
            <Input
                id={attrKey}
                type="text"
                className="w-full p-2 rounded! border border-gray-300! text-sm"
                value={attributes[attrKey as keyof typeof attributes] || ""}
                onChange={(e) =>
                    setAttribute(attrKey as string, e.target.value as string)
                }
            />
        </div>
    );
}
