/**
 * Shared option type for all option-based blocks (Radio, Dropdown, etc.)
 * Single source of truth for option structure
 */
export interface Option {
    value: string;
    type: "fixed" | "percentage" | "no_cost";
    regular: string;
    sale: string;
    default: boolean;
    image?: string;
    [key: string]: any;
}

