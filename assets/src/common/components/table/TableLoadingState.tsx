/**
 * Internal Dependencies
 */
import {
    ShadcnTable,
    TableBody,
    TableCell,
    TableRow,
} from "@/shadcn/components/ui/table";
import { cn } from "@/shadcn/lib/utils";
import type { TableColumn, NormalizedSelectionConfig, SizeClasses } from "./types";
import { TableHeaderRow } from "./TableHeaderRow";

interface TableLoadingStateProps<T = any> {
    containerClassName?: string;
    columns?: TableColumn<T>[];
    selectionConfig?: NormalizedSelectionConfig<T> | null;
    sizeClasses?: SizeClasses;
    rowCount?: number;
}

const SKELETON_ROW_WIDTHS = [
    ["w-2/5", "w-1/4", "w-1/5", "w-1/6"],
    ["w-1/3", "w-1/3", "w-1/6", "w-1/5"],
    ["w-2/5", "w-1/5", "w-1/4", "w-1/6"],
    ["w-1/4", "w-2/5", "w-1/5", "w-1/6"],
    ["w-1/3", "w-1/4", "w-1/5", "w-2/5"],
    ["w-2/5", "w-1/6", "w-1/3", "w-1/5"],
];

function SkeletonCell({ widthClass }: { widthClass: string }) {
    return (
        <div
            className={cn(
                "h-3.5 rounded-full bg-[var(--opt-border)] animate-pulse",
                widthClass,
            )}
        />
    );
}

export function TableLoadingState<T>({
    containerClassName,
    columns = [],
    selectionConfig = null,
    sizeClasses = { row: "h-12", cell: "px-3 py-5 text-sm", header: "h-12 px-3 text-sm" },
    rowCount = 6,
}: TableLoadingStateProps<T>) {
    const colCount = columns.length + (selectionConfig ? 1 : 0);

    return (
        <div
            className={cn(
                "bg-[var(--opt-card-bg)] rounded-[6px] border border-[var(--opt-border)]",
                containerClassName,
            )}
            data-slot="table-container"
        >
            <div className="overflow-x-auto p-4">
                <ShadcnTable className="w-full">
                    {columns.length > 0 && (
                        <TableHeaderRow
                            columns={columns}
                            selectionConfig={selectionConfig}
                            isAllSelected={false}
                            isIndeterminate={false}
                            handleSelectAll={() => {}}
                            sizeClasses={sizeClasses}
                        />
                    )}

                    <TableBody>
                        {/* Min-height spacer row when no columns are known */}
                        {columns.length === 0 && (
                            <TableRow className="border-0">
                                <TableCell className="p-0">
                                    <div className="min-h-[320px]" />
                                </TableCell>
                            </TableRow>
                        )}

                        {columns.length > 0 &&
                            Array.from({ length: rowCount }).map((_, rowIndex) => {
                                const widths = SKELETON_ROW_WIDTHS[rowIndex % SKELETON_ROW_WIDTHS.length]!;
                                return (
                                    <TableRow
                                        key={rowIndex}
                                        className={cn(
                                            "border-b border-[var(--opt-border)] last:border-0",
                                            sizeClasses.row,
                                        )}
                                    >
                                        {selectionConfig && (
                                            <TableCell className={cn("w-5", sizeClasses.cell)}>
                                                <div className="size-4 rounded bg-[var(--opt-border)] animate-pulse" />
                                            </TableCell>
                                        )}
                                        {columns.map((column, colIndex) => (
                                            <TableCell
                                                key={column.key}
                                                className={cn(
                                                    sizeClasses.cell,
                                                    column.align === "center" && "text-center",
                                                    column.align === "right" && "text-right",
                                                )}
                                            >
                                                <SkeletonCell
                                                    widthClass={widths[colIndex % widths.length]!}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}

                        {/* Min-height enforcer below skeleton rows */}
                        {columns.length > 0 && (
                            <TableRow className="border-0 h-0 p-0">
                                <TableCell
                                    colSpan={colCount}
                                    className="p-0 border-0"
                                >
                                    <div className="min-h-[40px]" />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </ShadcnTable>
            </div>
        </div>
    );
}
