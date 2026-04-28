/**
 * Type definitions for BlockSidebar components
 */

import { ReactNode, ElementType } from "react";

/**
 * Block settings structure from block configuration files
 */
export interface BlockSettings {
    title: string;
    icon?: ReactNode;
    tags?: string[];
    category?: string;
    component: ElementType;
    controls?: ElementType;
    attributes?: BlockAttributes;
    canvas?: boolean;
}

/**
 * Block attributes structure
 */
export interface BlockAttributes {
    displayName?: string;
    type?: string;
    label?: string;
    desc?: string;
    placeholder?: string;
    pricePosition?: string;
    required?: boolean;
    options?: any[];
    class?: string;
    id?: string;
    [key: string]: any;
}

/**
 * Props for BlockItem component
 */
export interface BlockItemProps {
    block: BlockSettings;
}

/**
 * Empty state component props
 */
export interface EmptyStateProps {
    message?: string;
    icon?: ReactNode;
}

