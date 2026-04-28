/**
 * WordPress Dependencies
 */
import { useCallback, useEffect, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Internal Dependencies
 */
import { Loader2, Search } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/shadcn/components/ui/input-group";
import { If } from "../If";

interface SearchInputProps {
    /** Async search function (legacy pattern — receives `{ search }` object) */
    searchFunc?: (query: {
        search: string;
    }) => Promise<{ complete?: boolean } | void>;
    /** Simple callback — preferred for new usage */
    onSearch?: (value: string) => void;
    placeholder?: string;
    className?: string;
    debounceDelay?: number;
    disabled?: boolean;
    value?: string;
}

export type SearchFunction = NonNullable<SearchInputProps["searchFunc"]>;

export const SearchInput = ({
    searchFunc,
    onSearch,
    placeholder = __("Search...", "optiontics"),
    className,
    debounceDelay = 300,
    disabled = false,
    value,
}: SearchInputProps) => {
    const [loading, setLoading] = useState(false);
    const [localValue, setLocalValue] = useState(value || "");
    const debounceTimer = useRef<NodeJS.Timeout>();

    // Sync local state with external value (for reset functionality)
    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);

    const debouncedSearch = useCallback(
        (searchTerm: string) => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);

            debounceTimer.current = setTimeout(async () => {
                if (onSearch) {
                    onSearch(searchTerm);
                    return;
                }
                if (searchFunc) {
                    setLoading(true);
                    try {
                        const res = await searchFunc({ search: searchTerm });
                        if (res?.complete !== false) setLoading(false);
                    } catch (error) {
                        console.error("Search error:", error);
                        setLoading(false);
                    }
                }
            }, debounceDelay);
        },
        [searchFunc, onSearch, debounceDelay],
    );

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setLocalValue(inputValue);
        debouncedSearch(inputValue);
    };

    return (
        <InputGroup
            className={cn(
                "h-9! rounded-[4px]! border-[var(--opt-border)]! bg-white",
                "has-[[data-slot=input-group-control]:focus-visible]:border-[var(--opt-primary)]!",
                "has-[[data-slot=input-group-control]:focus-visible]:ring-2!",
                "has-[[data-slot=input-group-control]:focus-visible]:ring-[rgba(74,59,214,0.15)]!",
                className,
            )}
        >
            <InputGroupAddon align="inline-start" className="text-[#9CA3AF]">
                <If condition={loading}>
                    <Loader2 className="size-4 animate-spin" />
                </If>
                <If condition={!loading}>
                    <Search className="size-4" />
                </If>
            </InputGroupAddon>
            <InputGroupInput
                placeholder={placeholder}
                value={localValue}
                onChange={handleInputChange}
                disabled={disabled}
                className="text-[var(--opt-text-default)] placeholder:text-[var(--opt-text-placeholder)] text-sm"
            />
        </InputGroup>
    );
};
