import { FormInput } from "./FormInput";
import { SelectBox } from "./SelectBox";
import { SelectInputProps } from "./types";

export const SelectField = ({
    control,
    name,
    label,
    placeholder,
    options,
    defaultValue,
    required = false,
    tooltip,
    unit,
    createNewOption,
    valueType,
    isMulti,
    emptyNotice,
}: SelectInputProps) => (
    <FormInput
        control={control}
        name={name}
        label={label}
        required={required}
        tooltip={tooltip}
        inputField={(field) => (
            <SelectBox
                options={options}
                placeholder={placeholder}
                defaultValue={isMulti ? undefined : defaultValue || field.value}
                value={isMulti ? field.value : undefined}
                unit={unit}
                createNewOption={createNewOption}
                valueType={valueType}
                isMulti={isMulti}
                emptyNotice={emptyNotice}
                {...field}
            />
        )}
    />
);
