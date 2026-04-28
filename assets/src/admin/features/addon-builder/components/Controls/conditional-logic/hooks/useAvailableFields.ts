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
import {
    getNodeDisplayName,
    getResolvedName,
    shouldExcludeNode,
} from "../utils";
import { FieldInfoType } from "../types";

/**
 * Hook to get available fields for conditional logic
 */
export const useAvailableFields = (currentNodeId: string) => {
    const { nodes } = useEditor((state) => ({ nodes: state.nodes }));

    return useMemo(() => {
        const fields: FieldInfoType[] = [];

        Object.keys(nodes || {}).forEach((nodeId) => {
            const nodeType = nodes[nodeId]?.data?.type;
            const resolvedName = getResolvedName(nodeType);

            if (shouldExcludeNode(nodeId, currentNodeId, resolvedName)) {
                return;
            }

            const node = nodes[nodeId];
            const displayName = getNodeDisplayName(node, nodeId);
            const fieldType = node?.data?.props?.type || "unknown";

            fields.push({
                id: nodeId,
                label: displayName,
                type: fieldType,
            });
        });

        return fields;
    }, [nodes, currentNodeId]);
};
