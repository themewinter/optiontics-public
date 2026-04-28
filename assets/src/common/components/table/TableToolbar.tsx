/**
 * WordPress Dependencies
 */
import { useCallback, useEffect, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * External Dependencies
 */
import { Filter } from "lucide-react";

/**
 * Internal Dependencies
 */
import { Button } from "@/shadcn/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/components/ui/select";
import { cn } from "@/shadcn/lib/utils";
import { TableToolbarConfig } from "./types";

import { SearchInput } from "../form/SearchInput";
import { If } from "../If";

interface TableToolbarProps {
    /**
     * Toolbar configuration
     */
    toolbar?: TableToolbarConfig;
    /**
     * Selected row keys (for bulk actions)
     */
    selectedRowKeys?: React.Key[];
    /**
     * Toolbar className
     */
    className?: string;
}

/**
 * TableToolbar Component
 *
 * Displays bulk actions, filters, and search functionality above the table.
 * Follows SRP by separating toolbar concerns from the main table component.
 */
export function TableToolbar({
    toolbar,
    selectedRowKeys = [],
    className,
}: TableToolbarProps) {
    const [selectedBulkAction, setSelectedBulkAction] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>(
        toolbar?.search?.value ?? "",
    );
    const [filterValues, setFilterValues] = useState<Record<string, any>>(
        toolbar?.filters?.reduce(
            (acc, filter) => {
                acc[filter.key] = filter.defaultValue ?? "";
                return acc;
            },
            {} as Record<string, any>,
        ) ?? {},
    );
    const debounceTimer = useRef<NodeJS.Timeout>();

    // Sync search value with external value
    useEffect(() => {
        if (toolbar?.search?.value !== undefined) {
            setSearchValue(toolbar.search.value);
        }
    }, [toolbar?.search?.value]);

    // Cleanup debounce timer
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    // Handle filter change
    const handleFilterChange = useCallback(
        (filterKey: string, value: any) => {
            const nextValues = { ...filterValues, [filterKey]: value };
            setFilterValues(nextValues);
            const filter = toolbar?.filters?.find((f) => f.key === filterKey);
            filter?.onChange?.(value);
        },
        [filterValues, toolbar?.filters],
    );

    // Handle bulk action apply
    const handleBulkActionApply = useCallback(() => {
        if (!selectedBulkAction) return;
        const action = toolbar?.bulkActions?.find(
            (a) => a.key === selectedBulkAction,
        );
        if (action && selectedRowKeys.length > 0) {
            action.onClick(selectedRowKeys);
            setSelectedBulkAction("");
        }
    }, [selectedBulkAction, toolbar?.bulkActions, selectedRowKeys]);

    const hasBulkActions =
        toolbar?.bulkActions && toolbar.bulkActions.length > 0;
    const hasFilters = toolbar?.filters && toolbar.filters.length > 0;
    const hasSearch = toolbar?.search !== undefined;
    const hasAnyToolbarFeature =
        hasBulkActions || hasFilters || hasSearch || toolbar?.extra;

    if (!hasAnyToolbarFeature) {
        return null;
    }

    const hasSelectedRows = selectedRowKeys.length > 0;

    return (
        <div
            className={cn(
                "flex flex-wrap items-center gap-3 pb-4 justify-between",
                className,
            )}
        >
            {/* Bulk Actions */}
            <If condition={Boolean(hasBulkActions)}>
                <div className="flex items-center gap-2">
                    <Select
                        value={selectedBulkAction}
                        onValueChange={setSelectedBulkAction}
                        disabled={!hasSelectedRows}
                    >
                        <SelectTrigger className="w-[140px] h-10 rounded-md">
                            <SelectValue
                                placeholder={__("Bulk Action", "optiontics")}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {toolbar.bulkActions?.map((action) => (
                                <SelectItem
                                    key={action.key}
                                    value={action.key}
                                    disabled={action.disabled}
                                >
                                    {action.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={handleBulkActionApply}
                        disabled={!selectedBulkAction || !hasSelectedRows}
                        size="default"
                        className="h-10"
                    >
                        {__("Apply", "optiontics")}
                    </Button>
                </div>
            </If>

            <div className="flex gap-2">
                {/* Filters */}
                <If condition={Boolean(hasFilters)}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="default"
                                className="h-10 gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                {__("Filters", "optiontics")}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            {toolbar.filters?.map((filter) => (
                                <div key={filter.key} className="px-2 py-1.5">
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                        {filter.label}
                                    </label>
                                    <Select
                                        value={
                                            filterValues[
                                                filter.key
                                            ]?.toString() ?? ""
                                        }
                                        onValueChange={(value) =>
                                            handleFilterChange(
                                                filter.key,
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue
                                                placeholder={__(
                                                    "Select",
                                                    "optiontics",
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filter.options.map((option) => (
                                                <SelectItem
                                                    key={String(option.value)}
                                                    value={String(option.value)}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </If>

                {/* Search */}
                <If condition={Boolean(hasSearch)}>
                    <SearchInput
                        placeholder={
                            toolbar.search?.placeholder ??
                            __("Search", "optiontics")
                        }
                        value={searchValue}
                        searchFunc={async (query) => {
                            toolbar?.search?.onChange?.(query.search);
                        }}
                        disabled={toolbar.search?.disabled}
                       
                    />
                </If>
            </div>

            {/* Extra Content */}
            <If condition={Boolean(toolbar?.extra)}>
                <div className="flex items-center">{toolbar.extra}</div>
            </If>
        </div>
    );
}
