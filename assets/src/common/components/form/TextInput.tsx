import { Input } from "@/shadcn/components/ui";
import { FormInput } from "./FormInput";
import { TextInputProps } from "./types";

// Text input
export const TextInput = ({
    control,
    name,
    label,
    placeholder,
    type = "text",
    required = false,
    tooltip,
    onBlur,
}: TextInputProps) => (
    <FormInput
        control={control}
        name={name}
        label={label}
        required={required}
        tooltip={tooltip}
        inputField={(field) => (
            <Input
                required={required}
                placeholder={placeholder}
                type={type}
                {...field}
                onBlur={
                    onBlur
                        ? (e) => {
                              field.onBlur(e);
                              onBlur(e);
                          }
                        : field.onBlur
                }
            />
        )}
    />
);
