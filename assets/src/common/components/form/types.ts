import { FocusEvent, ReactNode } from "@wordpress/element";

/**
 * Base props shared across all form inputs
 */
export interface BaseInputProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: any;
    name: string;
    label?: string;
    required?: boolean;
    tooltip?: string;
}

/**
 * Select option type supporting both string and number values
 */
export interface SelectOption {
    value: string | number;
    label: string;
}

/**
 * Base props for select components
 */
export interface BaseSelectProps {
    options?: SelectOption[] | null;
    placeholder?: string;
    defaultValue?: string | number;
    unit?: string;
    createNewOption?: boolean;
    valueType?: "string" | "number";
    isMulti?: boolean;
    className?: string;
    selectContentClassName?: string;
    emptyNotice?: ReactNode;
}

/**
 * Props for most standard inputs (text, email, number, textarea, url)
 */
export interface TextInputProps extends BaseInputProps {
    placeholder?: string;
    type?: string;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

/**
 * Props for checkbox and switch inputs
 */
export interface ToggleInputProps extends BaseInputProps {
    inlineLabel?: string;
}

/**
 * Props for radio group input
 */
export interface RadioInputProps extends ToggleInputProps {
    options: { label: string; value: string }[];
}
export interface SelectFieldProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: any;
    name: string;
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    groupLabel?: string;
    required?: boolean;
    tooltip?: string;
    inlineLabel?: string;
    className?: string;
    disabled?: boolean;
    onChange?: (value: string | number) => void;
}


/**
 * Props for select input
 */
export interface SelectInputProps extends BaseInputProps, BaseSelectProps {}
