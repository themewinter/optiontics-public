import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/shadcn/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcn/components/ui/popover";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
    type ReactNode,
} from "react";
import { Badge } from "@/shadcn/components/ui/badge";

/**
 * Overflow behavior options for MultiSelectValue
 */
export type OverflowBehavior = "wrap" | "wrap-when-open" | "cutoff";

/**
 * Search configuration for MultiSelectContent
 */
export interface SearchConfig {
    placeholder?: string;
    emptyMessage?: string;
}

/**
 * MultiSelect context type
 */
interface MultiSelectContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedValues: Set<string>;
    toggleValue: (value: string) => void;
    items: Map<string, ReactNode>;
    onItemAdded: (value: string, label: ReactNode) => void;
}

/**
 * Props for MultiSelect component
 */
export interface MultiSelectProps {
    children: ReactNode;
    values?: string[];
    defaultValues?: string[];
    onValuesChange?: (values: string[]) => void;
}

/**
 * Props for MultiSelectTrigger component
 */
export interface MultiSelectTriggerProps
    extends ComponentPropsWithoutRef<typeof Button> {
    className?: string;
    children?: ReactNode;
}

/**
 * Props for MultiSelectValue component
 */
export interface MultiSelectValueProps
    extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    placeholder?: string;
    clickToRemove?: boolean;
    overflowBehavior?: OverflowBehavior;
    className?: string;
}

/**
 * Props for MultiSelectContent component
 */
export interface MultiSelectContentProps
    extends Omit<ComponentPropsWithoutRef<typeof Command>, "children"> {
    search?: boolean | SearchConfig;
    children: ReactNode;
}

/**
 * Props for MultiSelectItem component
 */
export interface MultiSelectItemProps
    extends Omit<
        ComponentPropsWithoutRef<typeof CommandItem>,
        "value" | "onSelect"
    > {
    value: string;
    badgeLabel?: ReactNode;
    children: ReactNode;
    onSelect?: (value: string) => void;
}

/**
 * Props for MultiSelectGroup component
 */
export interface MultiSelectGroupProps
    extends ComponentPropsWithoutRef<typeof CommandGroup> {}

/**
 * Props for MultiSelectSeparator component
 */
export interface MultiSelectSeparatorProps
    extends ComponentPropsWithoutRef<typeof CommandSeparator> {}

/**
 * Context for MultiSelect component
 */
const MultiSelectContext = createContext<MultiSelectContextType | null>(null);

/**
 * MultiSelect root component
 *
 * @example
 * ```tsx
 * <MultiSelect values={selected} onValuesChange={setSelected}>
 *   <MultiSelectTrigger>
 *     <MultiSelectValue placeholder="Select items..." />
 *   </MultiSelectTrigger>
 *   <MultiSelectContent>
 *     <MultiSelectItem value="item1">Item 1</MultiSelectItem>
 *   </MultiSelectContent>
 * </MultiSelect>
 * ```
 */
export function MultiSelect({
    children,
    values,
    defaultValues,
    onValuesChange,
}: MultiSelectProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [internalValues, setInternalValues] = useState<Set<string>>(
        new Set<string>(values ?? defaultValues ?? []),
    );
    const selectedValues = values ? new Set(values) : internalValues;
    const [items, setItems] = useState<Map<string, ReactNode>>(new Map());

    const toggleValue = useCallback(
        (value: string) => {
            const getNewSet = (prev: Set<string>): Set<string> => {
                const newSet = new Set(prev);
                if (newSet.has(value)) {
                    newSet.delete(value);
                } else {
                    newSet.add(value);
                }
                return newSet;
            };

            if (values === undefined) {
                // Uncontrolled mode
                setInternalValues((prev) => {
                    const newSet = getNewSet(prev);
                    onValuesChange?.([...newSet]);
                    return newSet;
                });
            } else {
                // Controlled mode
                const newSet = getNewSet(selectedValues);
                onValuesChange?.([...newSet]);
            }
        },
        [values, selectedValues, onValuesChange],
    );

    const onItemAdded = useCallback((value: string, label: ReactNode) => {
        setItems((prev) => {
            if (prev.get(value) === label) return prev;
            return new Map(prev).set(value, label);
        });
    }, []);

    // Sync internal state when values prop changes in controlled mode
    useEffect(() => {
        if (values !== undefined) {
            setInternalValues(new Set(values));
        }
    }, [values]);

    return (
        <MultiSelectContext.Provider
            value={{
                open,
                setOpen,
                selectedValues,
                toggleValue,
                items,
                onItemAdded,
            }}
        >
            <Popover open={open} onOpenChange={setOpen} modal={true}>
                {children}
            </Popover>
        </MultiSelectContext.Provider>
    );
}

/**
 * MultiSelectTrigger component
 *
 * Renders a button that opens/closes the multi-select popover
 */
export function MultiSelectTrigger({
    className,
    children,
    ...props
}: MultiSelectTriggerProps) {
    const { open } = useMultiSelectContext();

    return (
        <PopoverTrigger asChild>
            <Button
                {...props}
                variant={props.variant ?? "outline"}
                role={props.role ?? "combobox"}
                aria-expanded={props["aria-expanded"] ?? open}
                className={cn(
                    "flex h-auto min-h-9 w-fit items-center justify-between gap-2 overflow-hidden rounded-md border border-input bg-transparent px-3 py-1.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                    className,
                )}
            >
                {children}
                <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
    );
}

/**
 * MultiSelectValue component
 *
 * Displays the selected values as badges with optional overflow handling
 */
export function MultiSelectValue({
    placeholder,
    clickToRemove = true,
    className,
    overflowBehavior = "wrap-when-open",
    ...props
}: MultiSelectValueProps) {
    const { selectedValues, toggleValue, items, open } =
        useMultiSelectContext();
    const [overflowAmount, setOverflowAmount] = useState<number>(0);
    const valueRef = useRef<HTMLDivElement | null>(null);
    const overflowRef = useRef<HTMLDivElement | null>(null);

    const shouldWrap =
        overflowBehavior === "wrap" ||
        (overflowBehavior === "wrap-when-open" && open);

    const checkOverflow = useCallback((): void => {
        if (valueRef.current == null) return;

        const containerElement = valueRef.current;
        const overflowElement = overflowRef.current;
        const itemElements = containerElement.querySelectorAll<HTMLElement>(
            "[data-selected-item]",
        );

        if (overflowElement != null) overflowElement.style.display = "none";
        itemElements.forEach((child) => child.style.removeProperty("display"));
        let amount = 0;
        for (let i = itemElements.length - 1; i >= 0; i--) {
            const child = itemElements[i]!;
            if (containerElement.scrollWidth <= containerElement.clientWidth) {
                break;
            }
            amount = itemElements.length - i;
            child.style.display = "none";
            overflowElement?.style.removeProperty("display");
        }
        setOverflowAmount(amount);
    }, []);

    const handleResize = useCallback(
        (node: HTMLDivElement | null): (() => void) | undefined => {
            if (node === null) {
                valueRef.current = null;
                return undefined;
            }

            valueRef.current = node;

            const mutationObserver = new MutationObserver(checkOverflow);
            const observer = new ResizeObserver(debounce(checkOverflow, 100));

            mutationObserver.observe(node, {
                childList: true,
                attributes: true,
                attributeFilter: ["class", "style"],
            });
            observer.observe(node);

            return () => {
                observer.disconnect();
                mutationObserver.disconnect();
                valueRef.current = null;
            };
        },
        [checkOverflow],
    );

    useEffect(() => {
        checkOverflow();
    }, [selectedValues.size, checkOverflow, open]);

    if (selectedValues.size === 0 && placeholder) {
        return (
            <span className="min-w-0 overflow-hidden text-sm font-normal text-muted-foreground">
                {placeholder}
            </span>
        );
    }

    return (
        <div
            {...props}
            ref={handleResize}
            className={cn(
                "flex w-full gap-1.5 overflow-hidden",
                shouldWrap && "h-full flex-wrap",
                className,
            )}
        >
            {[...selectedValues]
                .filter((value) => items.has(value))
                .map((value) => (
                    <Badge
                        variant="outline"
                        data-selected-item
                        className="group flex items-center gap-1"
                        key={value}
                        onClick={
                            clickToRemove
                                ? (e: React.MouseEvent<HTMLDivElement>) => {
                                      e.stopPropagation();
                                      toggleValue(value);
                                  }
                                : undefined
                        }
                    >
                        {items.get(value)}
                        {clickToRemove && (
                            <XIcon className="size-2 text-muted-foreground group-hover:text-destructive" />
                        )}
                    </Badge>
                ))}
            <div
                ref={overflowRef}
                style={{
                    display:
                        overflowAmount > 0 && !shouldWrap ? "block" : "none",
                }}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
            >
                +{overflowAmount} items
            </div>
        </div>
    );
}

/**
 * MultiSelectContent component
 *
 * Renders the popover content with search functionality
 */
export function MultiSelectContent({
    search = true,
    children,
    ...props
}: MultiSelectContentProps) {
    const canSearch = typeof search === "object" ? true : search;
    const searchConfig: SearchConfig | undefined =
        typeof search === "object" ? search : undefined;

    return (
        <>
            <div style={{ display: "none" }}>
                <Command>
                    <CommandList>{children}</CommandList>
                </Command>
            </div>
            <PopoverContent className="min-w-24 w-auto border-none p-2">
                <Command {...props}>
                    {canSearch ? (
                        <CommandInput placeholder={searchConfig?.placeholder} />
                    ) : (
                        <button autoFocus className="sr-only" />
                    )}
                    <CommandList>
                        {canSearch && (
                            <CommandEmpty>
                                {searchConfig?.emptyMessage}
                            </CommandEmpty>
                        )}
                        {children}
                    </CommandList>
                </Command>
            </PopoverContent>
        </>
    );
}

/**
 * MultiSelectItem component
 *
 * Renders a selectable item in the multi-select dropdown
 */
export function MultiSelectItem({
    value,
    children,
    badgeLabel,
    onSelect,
    ...props
}: MultiSelectItemProps) {
    const { toggleValue, selectedValues, onItemAdded } =
        useMultiSelectContext();
    const isSelected = selectedValues.has(value);

    useEffect(() => {
        onItemAdded(value, badgeLabel ?? children);
    }, [value, children, onItemAdded, badgeLabel]);

    const handleSelect = useCallback(() => {
        toggleValue(value);
        onSelect?.(value);
    }, [toggleValue, value, onSelect]);

    return (
        <CommandItem {...props} onSelect={handleSelect}>
            {children}
            <CheckIcon
                className={cn(
                    "mr-2 size-4",
                    isSelected ? "opacity-100" : "opacity-0",
                )}
            />
        </CommandItem>
    );
}

/**
 * MultiSelectGroup component
 *
 * Groups related items together in the dropdown
 */
export function MultiSelectGroup(props: MultiSelectGroupProps) {
    return <CommandGroup {...props} />;
}

/**
 * MultiSelectSeparator component
 *
 * Renders a visual separator between groups
 */
export function MultiSelectSeparator(props: MultiSelectSeparatorProps) {
    return <CommandSeparator {...props} />;
}

/**
 * Hook to access MultiSelect context
 *
 * @throws Error if used outside of MultiSelect component
 */
function useMultiSelectContext(): MultiSelectContextType {
    const context = useContext(MultiSelectContext);
    if (context == null) {
        throw new Error(
            "useMultiSelectContext must be used within a MultiSelectContext",
        );
    }
    return context;
}

/**
 * Debounce utility function
 *
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
function debounce<T extends (...args: never[]) => void>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function (this: unknown, ...args: Parameters<T>): void {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
