/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External Dependencies
 */
import { ChevronDown, LoaderCircle } from "lucide-react";

/**
 * Internal Dependencies
 */
import { Checkbox } from "@/shadcn/components/ui";
import { Input } from "@/shadcn/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcn/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/components/ui/select";
import { useSelectBox } from "./hooks/useSelectBox";
import { BaseSelectProps } from "./types";

export const SelectBox = ({
    options,
    placeholder,
    defaultValue,
    value,
    unit,
    createNewOption,
    valueType = "string",
    onChange,
    isMulti = false,
    disabled = false,
    className,
    selectContentClassName,
    showSearch = false,
    emptyNotice,
}: BaseSelectProps & {
    onChange: (value: string | number | Array<string | number>) => void;
    isMulti?: boolean;
    value?: string | number | Array<string | number>;
    showSearch?: boolean;
    disabled?: boolean;
}) => {
    const loading = options === undefined || options === null;
    const initialOptions = options || [];

    const {
        search,
        inputRef,
        filteredOptions,
        handleInputChange,
        handleSelectValue,
        shouldShowCreateOption,
        hasNoData,
        hasNoResults,
    } = useSelectBox({
        initialOptions,
        valueType,
        unit,
        createNewOption,
        defaultValue,
        onChange,
    });

    const userGuide = emptyNotice ? (
        <div className="bg-warning/10 p-5 m-2">{emptyNotice}</div>
    ) : null;

    if (!isMulti) {
        return (
            <Select
                value={defaultValue?.toString() || ""}
                onValueChange={handleSelectValue}
            >
                <SelectTrigger
                    disabled={disabled}
                    className={`w-full min-w-32 ${className || ""}`}
                >
                    <SelectValue
                        placeholder={placeholder}
                        className="min-w-32"
                    />
                    {loading && (
                        <LoaderCircle className="ml-auto animate-spin size-4" />
                    )}
                </SelectTrigger>
                <SelectContent
                    className={`max-h-80 h-full ${selectContentClassName}`}
                    position="popper"
                    side="bottom"
                    align="start"
                >
                    {(createNewOption || showSearch) && (
                        <div className="sticky top-0 bg-popover border-b border-border p-2 z-10">
                            <Input
                                ref={inputRef}
                                value={search}
                                onChange={handleInputChange}
                                onKeyDown={(e) => e.stopPropagation()}
                                placeholder={
                                    createNewOption
                                        ? __(
                                              "Type to search or create...",
                                              "optiontics",
                                          )
                                        : __("Search...", "optiontics")
                                }
                                type="text"
                                disabled={disabled}
                                className="mb-0"
                            />
                        </div>
                    )}

                    {userGuide}

                    <div className="max-h-64 overflow-y-auto">
                        {shouldShowCreateOption ? (
                            <SelectItem value={search.trim()}>
                                <div className="flex items-center space-x-1">
                                    <span>{__("Create:", "optiontics")}</span>
                                    <span className="font-medium">
                                        {search}
                                    </span>
                                    {unit && (
                                        <span className="text-muted-foreground">
                                            {unit}
                                        </span>
                                    )}
                                </div>
                            </SelectItem>
                        ) : (
                            filteredOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value.toString()}
                                >
                                    {option.label}
                                </SelectItem>
                            ))
                        )}

                        {hasNoData && (
                            <div className="p-4 text-center text-neutral-light">
                                {__("No data available", "optiontics")}
                            </div>
                        )}

                        {hasNoResults && (
                            <div className="p-4 text-center text-neutral-light">
                                {__("No results found", "optiontics")}
                            </div>
                        )}
                    </div>
                </SelectContent>
            </Select>
        );
    }

    // Multi-select variant using Popover + Checkbox
    const selectedValuesArr: Array<string | number> = Array.isArray(value)
        ? (value as Array<string | number>)
        : [];

    // Labels for selected values (use full options list to prevent missing labels)
    const selectedLabels = selectedValuesArr
        .map((v) => {
            const found = initialOptions.find(
                (o) => o.value.toString() === v.toString(),
            );
            return found ? found.label : String(v);
        })
        .filter(Boolean) as string[];

    // Summarized display to avoid overflow
    const maxDisplay = 2;
    const summary = selectedLabels.length
        ? selectedLabels.length <= maxDisplay
            ? selectedLabels.join(", ")
            : `${selectedLabels.slice(0, maxDisplay).join(", ")} +${
                  selectedLabels.length - maxDisplay
              } ${__("more", "optiontics")}`
        : "";
    const display = summary || placeholder || "";

    return (
        <Popover modal={true} open={disabled ? false : undefined}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    aria-disabled={disabled}
                    className="opt-select-box-popover-trigger inline-flex h-11 w-full max-w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden"
                >
                    {!display && (
                        <span className="text-muted-foreground">
                            {placeholder || "Select"}
                        </span>
                    )}
                    <span
                        className={`truncate text-left text-gray-600 ${
                            display ? "" : "text-muted-foreground"
                        }`}
                    >
                        {display}
                    </span>
                    {loading ? (
                        <LoaderCircle className="animate-spin size-4 ml-2" />
                    ) : (
                        <ChevronDown className="size-4 ml-2 text-muted-foreground" />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="p-2 w-64">
                <div className="flex flex-col gap-2">
                    <Input
                        ref={inputRef}
                        value={search}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.stopPropagation()}
                        placeholder={__("Search...", "optiontics")}
                        type="text"
                        disabled={disabled}
                        className="mb-2"
                    />

                    {userGuide}

                    {/* No create-new in multi-select to avoid accidental comma-joined options */}

                    <div className="opt-select-box-options max-h-56 overflow-auto pr-1">
                        {filteredOptions
                            .filter((opt) =>
                                isMulti
                                    ? !opt.value.toString().includes(",")
                                    : true,
                            )
                            .map((option) => {
                                const isChecked = selectedValuesArr.some(
                                    (v) =>
                                        v.toString() ===
                                        option.value.toString(),
                                );
                                return (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-2 px-1 py-1 cursor-pointer"
                                    >
                                        <Checkbox
                                            disabled={disabled}
                                            checked={isChecked}
                                            onCheckedChange={(checked) => {
                                                const exists =
                                                    selectedValuesArr.some(
                                                        (v) =>
                                                            v.toString() ===
                                                            option.value.toString(),
                                                    );
                                                let next: Array<
                                                    string | number
                                                > = selectedValuesArr;
                                                if (checked && !exists) {
                                                    next = [
                                                        ...selectedValuesArr,
                                                        option.value,
                                                    ];
                                                } else if (!checked && exists) {
                                                    next =
                                                        selectedValuesArr.filter(
                                                            (v) =>
                                                                v.toString() !==
                                                                option.value.toString(),
                                                        );
                                                }
                                                onChange(next);
                                            }}
                                        />
                                        <span className="text-sm">
                                            {option.label}
                                        </span>
                                    </label>
                                );
                            })}

                        {hasNoData && (
                            <div className="p-4 text-center text-neutral-light">
                                {__("No data available", "optiontics")}
                            </div>
                        )}
                        {hasNoResults && (
                            <div className="p-4 text-center text-neutral-light">
                                {__("No results found", "optiontics")}
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
