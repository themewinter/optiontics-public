import {
    COMPARISON_LABELS,
    COMPARISON_OPERATORS,
    EXCLUDED_NODE_IDS,
    EXCLUDED_RESOLVED_NAMES,
    NUMBER_FIELD_TYPES,
    OPTION_BASED_FIELD_TYPES,
    TEXT_BASED_FIELD_TYPES,
} from "./constant";
import { ComparisonOperatorType, FieldTypeType } from "./types";

/**
 * Checks if a node should be excluded from available fields
 */
export const shouldExcludeNode = (
    nodeId: string,
    currentNodeId: string,
    resolvedName: string | null,
): boolean => {
    return (
        EXCLUDED_NODE_IDS.includes(nodeId) ||
        nodeId === currentNodeId ||
        (resolvedName !== null &&
            EXCLUDED_RESOLVED_NAMES.includes(resolvedName))
    );
};

/**
 * Extracts display name from a node
 */
export const getNodeDisplayName = (node: any, nodeId: string): string => {
    // Prefer the user-set field label (e.g. "Frame Color", "Lens Type") so
    // multiple blocks of the same type can be told apart. Fall back to the
    // block type display name only when no label has been set.
    return (
        node?.data?.props?.label ||
        node?.data?.custom?.displayName ||
        node?.data?.displayName ||
        node?.data?.props?.displayName ||
        `Field ${nodeId.slice(0, 6)}`
    );
};

/**
 * Extracts resolved name from node type
 */
export const getResolvedName = (nodeType: any): string | null => {
    return typeof nodeType === "object" && nodeType !== null
        ? (nodeType as any)?.resolvedName
        : null;
};

/**
 * Gets field options for option-based fields
 */
export const extractFieldOptions = (node: any): string[] => {
    if (!node) return [];

    const fieldType = node?.data?.props?.type;
    const options = node?.data?.props?.options || [];

    if (OPTION_BASED_FIELD_TYPES.includes(fieldType)) {
        return options.map((opt: any) => opt.value || opt.label || "");
    }

    return [];
};

/**
 * Determines comparison operators based on field type
 */
export const determineComparisonOperators = (
    fieldType: FieldTypeType,
): ComparisonOperatorType[] => {
    if (OPTION_BASED_FIELD_TYPES.includes(fieldType)) {
        return COMPARISON_OPERATORS.OPTION.slice();
    }

    if (NUMBER_FIELD_TYPES.includes(fieldType)) {
        return COMPARISON_OPERATORS.NUMBER.slice();
    }

    if (TEXT_BASED_FIELD_TYPES.includes(fieldType)) {
        return COMPARISON_OPERATORS.TEXT.slice();
    }

    return [];
};

/**
 * Gets the label for a comparison operator
 */
export const getComparisonLabel = (operator: string): string => {
    return COMPARISON_LABELS[operator] || operator;
};
