/**
 * Internal Dependencies
 */
import { TableCell, TableRow } from "@/shadcn/components/ui/table";
import { Checkbox } from "@/shadcn/components/ui/checkbox";
import { cn } from "@/shadcn/lib/utils";
import type { TableColumn, NormalizedSelectionConfig, SizeClasses } from "./types";
import { getColumnWidthStyle, renderCellContent } from "./utils";

interface RowEventProps {
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    onDoubleClick?: (event: React.MouseEvent<HTMLElement>) => void;
    className?: string;
}

interface TableDataRowProps<T> {
    record: T;
    index: number;
    rowKey: string;
    columns: TableColumn<T>[];
    isSelected: boolean;
    selectionConfig: NormalizedSelectionConfig<T> | null;
    handleRowSelect: (record: T, index: number, selected: boolean) => void;
    sizeClasses: SizeClasses;
    rowProps: RowEventProps;
    customRowClassName?: string;
}

export function TableDataRow<T extends Record<string, any>>({
    record,
    index,
    rowKey,
    columns,
    isSelected,
    selectionConfig,
    handleRowSelect,
    sizeClasses,
    rowProps,
    customRowClassName,
}: TableDataRowProps<T>) {
    return (
        <TableRow
            data-row-key={rowKey}
            data-state={isSelected ? "selected" : undefined}
            className={cn(
                "border-b border-[var(--opt-border)] hover:bg-[var(--opt-row-hover)] transition-colors",
                isSelected && "bg-[var(--opt-primary-soft)] hover:bg-[var(--opt-primary-soft)]",
                sizeClasses.row,
                rowProps.className,
                customRowClassName,
            )}
            onClick={rowProps.onClick}
            onDoubleClick={rowProps.onDoubleClick}
        >
            {selectionConfig && (
                <TableCell
                    className={cn("w-5", sizeClasses.cell)}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleRowSelect(record, index, checked === true)}
                        disabled={selectionConfig.getCheckboxProps?.(record)?.disabled}
                    />
                </TableCell>
            )}

            {columns.map((column) => (
                <TableCell
                    key={column.key}
                    className={cn(
                        sizeClasses.cell,
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                        column.ellipsis && "truncate max-w-[200px]",
                    )}
                    style={getColumnWidthStyle(column.width)}
                >
                    {renderCellContent(column, record, index)}
                </TableCell>
            ))}
        </TableRow>
    );
}
