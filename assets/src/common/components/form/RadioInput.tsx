import { RadioGroup, RadioGroupItem } from "@/shadcn/components/ui/radio-group";
import { FormInput } from "./FormInput";
import { RadioInputProps } from "./types";

export const RadioInput = ({
    control,
    name,
    label,
    required = false,
    inlineLabel,
    tooltip,
    options,
}: RadioInputProps) => (
    <FormInput
        control={control}
        name={name}
        label={label}
        required={required}
        inlineLabel={inlineLabel}
        tooltip={tooltip}
        inputField={(field) => (
            <RadioGroup
                onValueChange={field.onChange}
                value={field.value || ""}
                className="flex flex-col gap-2"
            >
                {options.map((option) => (
                    <div
                        key={option.value}
                        className="flex items-center space-x-2"
                    >
                        <RadioGroupItem
                            value={option.value}
                            id={`${name}-${option.value}`}
                        />
                        <label
                            htmlFor={`${name}-${option.value}`}
                            className="text-sm"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </RadioGroup>
        )}
    />
);
