import { Input } from "@/shadcn/components/ui";
import { FormInput } from "./FormInput";
import { TextInputProps } from "./types";

export const EmailInput = ({
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
            <Input
                type="email"
                placeholder={placeholder ?? "you@example.com"}
                {...field}
            />
        )}
    />
);
