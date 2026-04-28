import { Frame } from "@craftjs/core";

/**
 * Internal dependencies
 */
import { useSelect } from "@wordpress/data";
import { stores } from "@/globalConstant";
import { blockLists } from "../constant";

const CraftFrame = () => {
    const { singleOption, isFiltering } = useSelect((select: any) =>
        select(stores?.addons).getAddonBuilderState(),
    );

    if (!singleOption || isFiltering)  return null;

    // Resolved names currently registered in the editor — saved layouts may
    // reference types that were removed/renamed (e.g. a deleted telephone
    // block). Without filtering, craft.js crashes during deserialize with
    // "Cannot destructure property 'type' of undefined".
    const registeredTypes = new Set<string>(
        blockLists.map((b: any) => b.attributes?.type).filter(Boolean),
    );

    // Helper function to convert craftData to proper Craft.js format
    const getCraftData = () => {
        // Default empty canvas structure
        const defaultData = {
            ROOT: {
                type: {
                    resolvedName: "body",
                },
                isCanvas: true,
                props: {
                    displayName: "Body",
                    background: "#ffffff",
                    color: "#000000",
                    minHeight: "350px",
                    minWidth: "300px",
                    width: {
                        size: 100,
                        unit: "%",
                    },
                    padding: {
                        top: 15,
                        right: 15,
                        bottom: 15,
                        left: 15,
                        isLinked: false,
                        unit: "px",
                    },
                },
                displayName: "Body",
                hidden: false,
                nodes: [],
                linkedNodes: {},
            },
        };

        if (!singleOption.craftData) {
            return defaultData;
        }

        try {
            // Parse craftData if it's a string
            let parsedData =
                typeof singleOption.craftData === "string"
                    ? JSON.parse(singleOption.craftData)
                    : singleOption.craftData;

            // If data already has ROOT key, strip any nodes whose type is no
            // longer in the resolver before handing it to craft.js.
            if (parsedData.ROOT) {
                return stripUnresolvedNodes(parsedData, registeredTypes);
            }

            // If data is in old format (without ROOT), convert it
            if (parsedData.resolvedName || parsedData.type) {
                // Convert old format to new format
                const resolvedName =
                    parsedData.resolvedName ||
                    parsedData.type?.resolvedName ||
                    "body";

                return {
                    ROOT: {
                        type: {
                            resolvedName: resolvedName,
                        },
                        isCanvas: parsedData.isCanvas ?? true,
                        props: parsedData.props || defaultData.ROOT.props,
                        displayName: parsedData.displayName || "Body",
                        hidden: parsedData.hidden ?? false,
                        nodes: parsedData.nodes || [],
                        linkedNodes: parsedData.linkedNodes || {},
                    },
                };
            }

            // If structure is unknown, return default
            return defaultData;
        } catch (error) {
            console.error("Error parsing craftData:", error);
            return defaultData;
        }
    };

    return <Frame data={getCraftData() as any} />;
};

// Types already logged this session — CraftFrame re-renders often and we
// don't want the console filled with duplicate warnings for the same orphan.
const warnedTypes = new Set<string>();

/**
 * Return a sanitized copy of the saved craft data with any nodes whose
 * resolved type isn't registered dropped. References to dropped nodes are
 * also cleaned from every parent's `nodes` array and `linkedNodes` map so
 * craft.js doesn't follow a dangling id.
 *
 * ROOT is always kept even if its resolvedName is absent from the registry —
 * losing ROOT would replace the entire layout on first render, which is far
 * more destructive than rendering an empty canvas.
 */
function stripUnresolvedNodes(
    data: Record<string, any>,
    registered: Set<string>,
): Record<string, any> {
    const removed = new Set<string>();
    const kept: Record<string, any> = {};

    Object.entries(data).forEach(([id, node]) => {
        if (!node || typeof node !== "object") {
            removed.add(id);
            return;
        }
        if (id === "ROOT") {
            kept[id] = node;
            return;
        }

        const resolvedName =
            typeof node.type === "string"
                ? node.type
                : node.type?.resolvedName;

        if (resolvedName && registered.has(resolvedName)) {
            kept[id] = node;
        } else {
            removed.add(id);
            if (resolvedName && !warnedTypes.has(resolvedName)) {
                warnedTypes.add(resolvedName);
                console.warn(
                    `[optiontics] Dropping saved node(s) with unregistered type "${resolvedName}" — the block is no longer in the editor.`,
                );
            }
        }
    });

    if (removed.size === 0) {
        return kept;
    }

    // Clean references in every surviving node so craft.js never follows a
    // dangling id during toNode(). We also clear any `parent` pointing at a
    // removed ancestor.
    Object.keys(kept).forEach((id) => {
        const node = kept[id];
        const updated: Record<string, any> = { ...node };

        if (Array.isArray(node.nodes)) {
            updated.nodes = node.nodes.filter(
                (childId: string) => !removed.has(childId),
            );
        }

        if (node.linkedNodes && typeof node.linkedNodes === "object") {
            const cleanedLinked: Record<string, string> = {};
            Object.entries(node.linkedNodes as Record<string, string>).forEach(
                ([slot, childId]) => {
                    if (!removed.has(childId)) {
                        cleanedLinked[slot] = childId;
                    }
                },
            );
            updated.linkedNodes = cleanedLinked;
        }

        if (node.parent && removed.has(node.parent)) {
            updated.parent = "ROOT";
        }

        kept[id] = updated;
    });

    return kept;
}

export default CraftFrame;
