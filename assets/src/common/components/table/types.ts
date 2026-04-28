import { ReactNode } from "@wordpress/element";

export interface SizeClasses {
    row: string;
    cell: string;
    header: string;
}

export interface NormalizedSelectionConfig<T = any> {
    type: "checkbox" | "radio";
    showSelectAll: boolean;
    selectedRowKeys?: React.Key[];
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean; name?: string };
}

/**
 * Table Column Definition
 */
export interface TableColumn<T = any> {
    /**
     * Unique key for the column
     */
    key: string;
    /**
     * Column header title
     */
    title: ReactNode;
    /**
     * Data property path to display (supports dot notation)
     */
    dataIndex?: string | string[];
    /**
     * Column width
     */
    width?: string | number;
    /**
     * Text alignment
     */
    align?: "left" | "center" | "right";
    /**
     * Custom render function for cell content
     */
    render?: (
        value: any,
        record: T,
        index: number,
    ) => ReactNode;
    /**
     * Whether column is sortable
     */
    sorter?: boolean | ((a: T, b: T) => number);
    /**
     * Fixed column position
     */
    fixed?: "left" | "right";
    /**
     * Whether to show ellipsis for long text
     */
    ellipsis?: boolean;
}

/**
 * Table Row Selection Configuration
 */
export interface TableRowSelection<T = any> {
    /**
     * Selection type: checkbox (multiple) or radio (single)
     */
    type?: "checkbox" | "radio";
    /**
     * Selected row keys
     */
    selectedRowKeys?: React.Key[];
    /**
     * Callback when selection changes
     */
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    /**
     * Callback when select all checkbox is clicked
     */
    onSelectAll?: (
        selected: boolean,
        selectedRows: T[],
        changeRows: T[],
    ) => void;
    /**
     * Function to determine if a row is selectable
     */
    getCheckboxProps?: (record: T) => {
        disabled?: boolean;
        name?: string;
    };
    /**
     * Whether to show select all checkbox in header
     */
    showSelectAll?: boolean;
}

/**
 * Bulk Action Configuration
 */
export interface BulkAction {
    /**
     * Unique key for the action
     */
    key: string;
    /**
     * Action label
     */
    label: ReactNode;
    /**
     * Action callback
     */
    onClick: (selectedRowKeys: React.Key[]) => void | Promise<void>;
    /**
     * Whether the action is destructive
     */
    destructive?: boolean;
    /**
     * Whether the action is disabled
     */
    disabled?: boolean;
}

/**
 * Filter Configuration
 */
export interface TableFilter {
    /**
     * Unique key for the filter
     */
    key: string;
    /**
     * Filter label
     */
    label: ReactNode;
    /**
     * Filter options
     */
    options: Array<{ label: ReactNode; value: any }>;
    /**
     * Default filter value
     */
    defaultValue?: any;
    /**
     * Callback when filter changes
     */
    onChange?: (value: any) => void;
}

/**
 * Search Configuration
 */
export interface TableSearch {
    /**
     * Search placeholder text
     */
    placeholder?: string;
    /**
     * Current search value
     */
    value?: string;
    /**
     * Callback when search value changes
     */
    onChange?: (value: string) => void;
    /**
     * Whether search is disabled
     */
    disabled?: boolean;
    /**
     * Debounce delay in milliseconds (default: 300)
     */
    debounceDelay?: number;
}

/**
 * Table Toolbar Configuration
 */
export interface TableToolbarConfig {
    /**
     * Bulk actions configuration
     */
    bulkActions?: BulkAction[];
    /**
     * Filters configuration
     */
    filters?: TableFilter[];
    /**
     * Search configuration
     */
    search?: TableSearch;
    /**
     * Custom toolbar content
     */
    extra?: ReactNode;
}

/**
 * Table Props Interface
 */
export interface TableProps<T = any> {
    /**
     * Data source array
     */
    dataSource: T[];
    /**
     * Column definitions
     */
    columns: TableColumn<T>[];
    /**
     * Unique key for each row (string key path or function)
     */
    rowKey?: string | ((record: T, index: number) => string);
    /**
     * Row selection configuration
     */
    rowSelection?: TableRowSelection<T> | boolean;
    /**
     * Toolbar configuration
     */
    toolbar?: TableToolbarConfig;
    /**
     * Loading state
     */
    loading?: boolean;
    /**
     * Empty state content
     */
    emptyText?: ReactNode;
    /**
     * Custom empty state renderer
     */
    emptyRender?: () => ReactNode;
    /**
     * Table className
     */
    className?: string;
    /**
     * Container className
     */
    containerClassName?: string;
    /**
     * Table size
     */
    size?: "small" | "default" | "large";
    /**
     * Whether to show table header
     */
    showHeader?: boolean;
    /**
     * Row click handler
     */
    onRow?: (
        record: T,
        index: number,
    ) => {
        onClick?: (event: React.MouseEvent<HTMLElement>) => void;
        onDoubleClick?: (event: React.MouseEvent<HTMLElement>) => void;
        className?: string;
    };
    /**
     * Custom row className generator
     */
    rowClassName?: (record: T, index: number) => string;
}

