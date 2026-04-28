/**
 * WordPress Dependencies
 */
import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Internal Dependencies
 */
import { ShadcnTable, TableBody } from "@/shadcn/components/ui/table";
import { cn } from "@/shadcn/lib/utils";
import { TableProps } from "./types";
import { useTableSelection } from "./hooks/useTableSelection";
import { TableHeaderRow } from "./TableHeaderRow";
import { TableDataRow } from "./TableDataRow";
import { TableEmptyRow } from "./TableEmptyRow";
import { TableLoadingState } from "./TableLoadingState";
import { getSizeClasses } from "./utils";

export function Table<T extends Record<string, any>>({
    dataSource = [],
    columns = [],
    rowKey = "id",
    rowSelection,
    loading = false,
    emptyText = __("No data available", "optiontics"),
    emptyRender,
    className,
    containerClassName,
    size = "default",
    showHeader = true,
    onRow,
    rowClassName,
}: TableProps<T>) {
    const {
        selectionConfig,
        isAllSelected,
        isIndeterminate,
        handleRowSelect,
        handleSelectAll,
        isRowSelected,
        getRowKey,
    } = useTableSelection(dataSource, rowKey, rowSelection);

    const sizeClasses = useMemo(() => getSizeClasses(size), [size]);
    const colSpan = columns.length + (selectionConfig ? 1 : 0);

    if (loading) {
        return (
            <TableLoadingState
                containerClassName={containerClassName}
                columns={columns}
                selectionConfig={selectionConfig}
                sizeClasses={sizeClasses}
            />
        );
    }

    return (
        <div
            className={cn(
                "bg-[var(--opt-card-bg)] rounded-[6px] border border-[var(--opt-border)]",
                containerClassName,
            )}
            data-slot="table-container"
        >
            <div className="overflow-x-auto p-4">
                <ShadcnTable className={cn("w-full", className)}>
                    {showHeader && (
                        <TableHeaderRow
                            columns={columns}
                            selectionConfig={selectionConfig}
                            isAllSelected={isAllSelected}
                            isIndeterminate={isIndeterminate}
                            handleSelectAll={handleSelectAll}
                            sizeClasses={sizeClasses}
                        />
                    )}

                    <TableBody>
                        {dataSource.length === 0 ? (
                            <TableEmptyRow
                                colSpan={colSpan}
                                emptyText={emptyText}
                                emptyRender={emptyRender}
                            />
                        ) : (
                            dataSource.map((record, index) => {
                                const key = getRowKey(record, index);
                                return (
                                    <TableDataRow
                                        key={key}
                                        record={record}
                                        index={index}
                                        rowKey={key}
                                        columns={columns}
                                        isSelected={isRowSelected(record, index)}
                                        selectionConfig={selectionConfig}
                                        handleRowSelect={handleRowSelect}
                                        sizeClasses={sizeClasses}
                                        rowProps={onRow?.(record, index) ?? {}}
                                        customRowClassName={rowClassName?.(record, index)}
                                    />
                                );
                            })
                        )}
                    </TableBody>
                </ShadcnTable>
            </div>
        </div>
    );
}
