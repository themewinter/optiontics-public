import { Switch } from "@/shadcn/components/ui";
import { FormInput } from "./FormInput";
import { ToggleInputProps } from "./types";

export const SwitchInput = ({
    control,
    name,
    label,
    required = false,
}: ToggleInputProps) => (
    <FormInput
        control={control}
        name={name}
        label={label}
        required={required}
        inputField={(field) => (
            <Switch
                checked={field.value ?? false}
                onCheckedChange={(v) => field.onChange(Boolean(v))}
                id={name}
            />
        )}
    />
);
