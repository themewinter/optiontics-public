import { useCallback, useMemo, useState } from "@wordpress/element";
import { TableRowSelection } from "../types";

/**
 * Hook for managing table row selection
 *
 * @template T - The type of data items
 * @param dataSource - Array of data items
 * @param rowKey - Function or key path to get unique row key
 * @param rowSelection - Row selection configuration
 * @returns Selection state and handlers
 */
export function useTableSelection<T extends Record<string, any>>(
    dataSource: T[],
    rowKey: string | ((record: T, index: number) => string),
    rowSelection?: TableRowSelection<T> | boolean,
) {
    // Normalize rowSelection config
    const selectionConfig = useMemo(() => {
        if (!rowSelection) return null;
        if (typeof rowSelection === "boolean") {
            return { type: "checkbox" as const, showSelectAll: true };
        }
        return {
            type: "checkbox" as const,
            showSelectAll: true,
            ...rowSelection,
        };
    }, [rowSelection]);

    // Internal selection state (used when not controlled)
    const [internalSelectedKeys, setInternalSelectedKeys] = useState<
        React.Key[]
    >([]);

    // Get selected keys (controlled or internal)
    const selectedRowKeys = useMemo(() => {
        if (!selectionConfig) return [];
        return (
            selectionConfig.selectedRowKeys ??
            internalSelectedKeys
        );
    }, [selectionConfig, internalSelectedKeys]);

    // Get row key function
    const getRowKey = useCallback(
        (record: T, index: number): string => {
            if (typeof rowKey === "function") {
                return rowKey(record, index);
            }
            const key = record[rowKey];
            return key != null ? String(key) : String(index);
        },
        [rowKey],
    );

    // Get selected rows
    const selectedRows = useMemo(() => {
        return dataSource.filter((record, index) => {
            const key = getRowKey(record, index);
            return selectedRowKeys.includes(key);
        });
    }, [dataSource, selectedRowKeys, getRowKey]);

    // Check if all rows are selected
    const isAllSelected = useMemo(() => {
        if (!dataSource.length || !selectionConfig) return false;
        const selectableRows = dataSource.filter((record) => {
            const checkboxProps =
                selectionConfig.getCheckboxProps?.(record) ?? {};
            return !checkboxProps.disabled;
        });
        return (
            selectableRows.length > 0 &&
            selectableRows.every((record, index) => {
                const key = getRowKey(record, index);
                return selectedRowKeys.includes(key);
            })
        );
    }, [dataSource, selectedRowKeys, selectionConfig, getRowKey]);

    // Check if some rows are selected (indeterminate state)
    const isIndeterminate = useMemo(() => {
        if (!selectionConfig) return false;
        const selectableRows = dataSource.filter((record) => {
            const checkboxProps =
                selectionConfig.getCheckboxProps?.(record) ?? {};
            return !checkboxProps.disabled;
        });
        const selectedCount = selectableRows.filter((record, index) => {
            const key = getRowKey(record, index);
            return selectedRowKeys.includes(key);
        }).length;
        return selectedCount > 0 && selectedCount < selectableRows.length;
    }, [dataSource, selectedRowKeys, selectionConfig, getRowKey]);

    // Handle single row selection
    const handleRowSelect = useCallback(
        (record: T, index: number, selected: boolean) => {
            if (!selectionConfig) return;

            const key = getRowKey(record, index);
            const checkboxProps =
                selectionConfig.getCheckboxProps?.(record) ?? {};
            if (checkboxProps.disabled) return;

            let nextSelectedKeys: React.Key[];
            if (selected) {
                nextSelectedKeys = [...selectedRowKeys, key];
            } else {
                nextSelectedKeys = selectedRowKeys.filter((k) => k !== key);
            }

            if (selectionConfig.selectedRowKeys === undefined) {
                setInternalSelectedKeys(nextSelectedKeys);
            }

            const nextSelectedRows = dataSource.filter((r, i) => {
                const k = getRowKey(r, i);
                return nextSelectedKeys.includes(k);
            });

            selectionConfig.onChange?.(nextSelectedKeys, nextSelectedRows);
        },
        [selectionConfig, selectedRowKeys, dataSource, getRowKey],
    );

    // Handle select all
    const handleSelectAll = useCallback(
        (selected: boolean) => {
            if (!selectionConfig) return;

            const selectableRows = dataSource.filter((record) => {
                const checkboxProps =
                    selectionConfig.getCheckboxProps?.(record) ?? {};
                return !checkboxProps.disabled;
            });

            let nextSelectedKeys: React.Key[];
            if (selected) {
                nextSelectedKeys = [
                    ...selectedRowKeys,
                    ...selectableRows
                        .map((record, index) => getRowKey(record, index))
                        .filter((key) => !selectedRowKeys.includes(key)),
                ];
            } else {
                const selectableKeys = selectableRows.map((record, index) =>
                    getRowKey(record, index),
                );
                nextSelectedKeys = selectedRowKeys.filter(
                    (key) => !selectableKeys.includes(key as string),
                );
            }

            if (selectionConfig.selectedRowKeys === undefined) {
                setInternalSelectedKeys(nextSelectedKeys);
            }

            const nextSelectedRows = dataSource.filter((r, i) => {
                const k = getRowKey(r, i);
                return nextSelectedKeys.includes(k);
            });

            selectionConfig.onSelectAll?.(
                selected,
                nextSelectedRows,
                selectableRows,
            );
            selectionConfig.onChange?.(nextSelectedKeys, nextSelectedRows);
        },
        [selectionConfig, selectedRowKeys, dataSource, getRowKey],
    );

    // Check if row is selected
    const isRowSelected = useCallback(
        (record: T, index: number): boolean => {
            if (!selectionConfig) return false;
            const key = getRowKey(record, index);
            return selectedRowKeys.includes(key);
        },
        [selectionConfig, selectedRowKeys, getRowKey],
    );

    return {
        selectionConfig,
        selectedRowKeys,
        selectedRows,
        isAllSelected,
        isIndeterminate,
        handleRowSelect,
        handleSelectAll,
        isRowSelected,
        getRowKey,
    };
}

