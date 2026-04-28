import { Checkbox } from "@/shadcn/components/ui";
import { FormInput } from "./FormInput";
import { ToggleInputProps } from "./types";


export const CheckboxInput = ({
    control,
    name,
    label,
    required = false,
    inlineLabel,
    tooltip,
}: ToggleInputProps) => (
    <FormInput
        control={control}
        name={name}
        label={label}
        required={required}
        inlineLabel={inlineLabel}
        tooltip={tooltip}
        inputField={(field) => (
            <Checkbox
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                id={name}
            />
        )}
    />
);