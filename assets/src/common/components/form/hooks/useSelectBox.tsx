/**
 * WordPress Dependencies
 */
import { useCallback, useEffect, useRef, useState } from "@wordpress/element";
import { SelectOption } from "../types";

/**
 * Internal Dependencies
 */

interface UseSelectBoxProps {
    initialOptions: SelectOption[];
    valueType: "string" | "number";
    unit?: string;
    createNewOption?: boolean;
    defaultValue?: string | number;
    onChange: (value: string | number) => void;
}

export const useSelectBox = ({
    initialOptions,
    valueType,
    unit,
    createNewOption,
    defaultValue,
    onChange,
}: UseSelectBoxProps) => {
    // States
    const [options, setOptions] = useState<SelectOption[]>(() => {
        // Check if defaultValue exists in initialOptions
        if (
            defaultValue !== undefined &&
            defaultValue !== null &&
            defaultValue !== ""
        ) {
            const defaultExists = initialOptions.some(
                (option) => option.value.toString() === defaultValue.toString(),
            );

            if (!defaultExists) {
                // Create a new option for the defaultValue
                const defaultOption: SelectOption = {
                    value: defaultValue,
                    label: `${defaultValue}${unit ? ` ${unit}` : ""}`,
                };
                return [defaultOption, ...initialOptions];
            }
        }
        return initialOptions;
    });
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Update options when initialOptions change
    useEffect(() => {
        if (
            defaultValue !== undefined &&
            defaultValue !== null &&
            defaultValue !== ""
        ) {
            const defaultExists = initialOptions.some(
                (option) => option.value.toString() === defaultValue.toString(),
            );

            if (!defaultExists) {
                // Create a new option for the defaultValue
                const defaultOption: SelectOption = {
                    value: defaultValue,
                    label: `${defaultValue}${unit ? ` ${unit}` : ""}`,
                };
                setOptions([defaultOption, ...initialOptions]);
            } else {
                setOptions(initialOptions);
            }
        } else {
            setOptions(initialOptions);
        }
    }, [initialOptions, defaultValue, unit]);

    // Debounce effect for search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1000); // 1s debounce delay

        return () => clearTimeout(timer);
    }, [search]);

    // Filter options based on debounced search - search by both label and value
    const filteredOptions = options.filter((option) => {
        const searchTerm = debouncedSearch.toLowerCase();
        const labelMatches = option.label.toLowerCase().includes(searchTerm);
        const valueMatches = option.value
            .toString()
            .toLowerCase()
            .includes(searchTerm);

        return labelMatches || valueMatches;
    });

    // Debounced input change handler
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
        },
        [],
    );

    // Create new option handler
    const handleCreate = useCallback(() => {
        const searchValue = search.trim();
        if (!searchValue) return;

        const newValue =
            valueType === "number" ? parseFloat(searchValue) || 0 : searchValue;
        const newOption: SelectOption = {
            value: newValue,
            label: `${searchValue} ${unit || ""}`,
        };
        setOptions((prev) => [...prev, newOption]);
        onChange(newValue);
        setSearch("");
        setDebouncedSearch("");
    }, [search, valueType, unit, onChange]);

    // Handle value change with type conversion
    const handleValueChange = useCallback(
        (value: string) => {
            if (valueType === "number") {
                const numericValue = parseFloat(value);
                onChange(isNaN(numericValue) ? 0 : numericValue);
            } else {
                onChange(value);
            }
        },
        [valueType, onChange],
    );

    // Handle select value change
    const handleSelectValue = useCallback(
        (value: string) => {
            // Prevent handling empty values
            if (!value || value.trim() === "") {
                return;
            }

            // Check if this is a "create new" action
            if (
                createNewOption &&
                value === search.trim() &&
                filteredOptions.length === 0 &&
                search.trim()
            ) {
                handleCreate();
                return;
            }

            handleValueChange(value);
        },
        [
            createNewOption,
            search,
            filteredOptions.length,
            handleCreate,
            handleValueChange,
        ],
    );

    // Computed values
    const shouldShowCreateOption =
        createNewOption &&
        filteredOptions.length === 0 &&
        debouncedSearch &&
        search.trim();

    const validFilteredOptions = filteredOptions.filter(
        (option) => option.value.toString().trim() !== "",
    );

    const hasNoData = options.length === 0 && !debouncedSearch;
    const hasNoResults =
        filteredOptions.length === 0 && debouncedSearch && !createNewOption;

    return {
        // State
        options,
        search,
        debouncedSearch,
        inputRef,

        // Filtered data
        filteredOptions: validFilteredOptions,

        // Handlers
        handleInputChange,
        handleSelectValue,
        handleCreate,

        // Computed values
        shouldShowCreateOption,
        hasNoData,
        hasNoResults,
    };
};
