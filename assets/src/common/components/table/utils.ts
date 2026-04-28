import type { TableColumn, SizeClasses } from "./types";

export function getNestedValue(obj: Record<string, any>, path: string | string[]): any {
    if (typeof path === "string") return obj[path];
    return path.reduce((current: any, prop) => current?.[prop], obj as any);
}

export function getSizeClasses(size: "small" | "default" | "large"): SizeClasses {
    switch (size) {
        case "small":
            return { row: "h-10", cell: "px-2 py-5 text-sm", header: "h-10 px-2 text-sm" };
        case "large":
            return { row: "h-14", cell: "px-4 py-5 text-base", header: "h-14 px-4 text-base" };
        default:
            return { row: "h-12", cell: "px-3 py-5 text-sm", header: "h-12 px-3 text-sm" };
    }
}

export function getColumnWidthStyle(width?: string | number): React.CSSProperties | undefined {
    if (!width) return undefined;
    const value = typeof width === "number" ? `${width}px` : width;
    return { width: value, maxWidth: value };
}

export function renderCellContent<T extends Record<string, any>>(
    column: TableColumn<T>,
    record: T,
    index: number,
): React.ReactNode {
    const value = column.dataIndex ? getNestedValue(record, column.dataIndex) : undefined;
    if (column.render) return column.render(value, record, index);
    return value != null ? String(value) : "";
}
