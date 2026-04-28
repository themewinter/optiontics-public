import { Textarea } from "@/shadcn/components/ui";
import { FormInput } from "./FormInput";
import { TextInputProps } from "./types";

export const TextareaInput = ({
    control,
    name,
    label,
    placeholder,
    required = false,
    tooltip,
}: TextInputProps) => (
    <FormInput
        control={control}
        name={name}
        label={label}
        required={required}
        tooltip={tooltip}
        inputField={(field) => (
            <Textarea placeholder={placeholder} {...field} />
        )}
    />
);
