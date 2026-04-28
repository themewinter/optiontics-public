/**
 * WordPress dependencies
 */
import { useMemo } from "@wordpress/element";

/**
 * External dependencies
 */
import { useEditor } from "@craftjs/core";

/**
 * Internal dependencies
 */
import { determineComparisonOperators, extractFieldOptions } from "../utils";

/**
 * Hook to manage field options and comparison operators
 */
export const useFieldMetadata = (fieldId: string) => {
    const { nodes } = useEditor((state) => ({ nodes: state.nodes }));

    return useMemo(() => {
        const node = nodes[fieldId];
        if (!node) {
            return {
                options: [],
                // comparisonOperators: COMPARISON_OPERATORS.BASIC,
                comparisonOperators: [],
            };
        }

        const fieldType = node?.data?.props?.type;
        return {
            options: extractFieldOptions(node),
            comparisonOperators: determineComparisonOperators(fieldType),
        };
    }, [nodes, fieldId]);
};