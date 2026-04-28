/**
 * WordPress Dependencies
 */
import { useEffect, useRef } from "@wordpress/element";

/**
 * Internal Dependencies
 */
import {
    TableHead,
    TableHeader,
    TableRow,
} from "@/shadcn/components/ui/table";
import { Checkbox } from "@/shadcn/components/ui/checkbox";
import { cn } from "@/shadcn/lib/utils";
import type { TableColumn, NormalizedSelectionConfig, SizeClasses } from "./types";

interface TableHeaderRowProps<T> {
    columns: TableColumn<T>[];
    selectionConfig: NormalizedSelectionConfig<T> | null;
    isAllSelected: boolean;
    isIndeterminate: boolean;
    handleSelectAll: (selected: boolean) => void;
    sizeClasses: SizeClasses;
}

export function TableHeaderRow<T>({
    columns,
    selectionConfig,
    isAllSelected,
    isIndeterminate,
    handleSelectAll,
    sizeClasses,
}: TableHeaderRowProps<T>) {
    const selectAllCheckboxRef = useRef<HTMLDivElement>(null);

    // Radix UI Checkbox is button-based — set aria-checked="mixed" for indeterminate state
    useEffect(() => {
        if (!selectAllCheckboxRef.current) return;
        const btn = selectAllCheckboxRef.current.querySelector("[data-state]") as HTMLElement | null;
        if (btn && isIndeterminate) {
            btn.setAttribute("aria-checked", "mixed");
        }
    }, [isIndeterminate]);

    return (
        <TableHeader>
            <TableRow
                className={cn(
                    "bg-[var(--opt-header-bg)] hover:bg-[var(--opt-header-bg)] rounded-[6px] border-0",
                    sizeClasses.header,
                )}
            >
                {selectionConfig && (
                    <TableHead className={cn("w-5", sizeClasses.header)}>
                        {selectionConfig.type === "checkbox" &&
                            selectionConfig.showSelectAll !== false && (
                                <div ref={selectAllCheckboxRef}>
                                    <Checkbox
                                        checked={isAllSelected}
                                        onCheckedChange={(checked) => handleSelectAll(checked === true)}
                                    />
                                </div>
                            )}
                    </TableHead>
                )}

                {columns.map((column) => (
                    <TableHead
                        key={column.key}
                        className={cn(
                            sizeClasses.header,
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right",
                            column.width && "w-[var(--col-width)]",
                        )}
                        style={
                            column.width
                                ? ({
                                      "--col-width":
                                          typeof column.width === "number"
                                              ? `${column.width}px`
                                              : column.width,
                                  } as React.CSSProperties)
                                : undefined
                        }
                    >
                        {column.title}
                    </TableHead>
                ))}
            </TableRow>
        </TableHeader>
    );
}
