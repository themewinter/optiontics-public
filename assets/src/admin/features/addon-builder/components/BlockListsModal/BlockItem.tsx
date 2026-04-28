/**
 * WordPress dependencies
 */
import { useDispatch } from "@wordpress/data";

/**
 * External dependencies
 */
import { stores } from "@/globalConstant";
import { Element, useEditor } from "@craftjs/core";

/**
 * Internal dependencies
 */
import { BlockItemProps } from "./types";

/**
 * BlockItem component for rendering individual block items in the sidebar.
 * Handles drag-and-drop and click-to-add functionality for Craft.js blocks.
 */
export const BlockItem = ({ block }: BlockItemProps) => {
  const {
    connectors,
    query,
    actions: { selectNode, add },
  } = useEditor();
  const { setAddonBuilderState } = useDispatch(stores?.addons);

  /**
   * Handles attaching a new Craft.js block to the canvas.
   */
  const handleCreateBlock = (ref: HTMLElement | null) => {
    if (!ref) return;

    const Component = block.component as React.ElementType;

    if (block.canvas) {
      connectors.create(ref, <Element canvas is={Component} />);
    } else {
      connectors.create(ref, <Component />);
    }
  };

  /**
   * Handles creating a new Craft.js block and selecting it.
   * Validates block structure and adds it to the ROOT node.
   */
  const handleClick = () => {
    try {
      // Get the ROOT node
      const rootNode = query.node("ROOT").get();
      if (!rootNode) {
        console.error("ROOT node not found");
        return;
      }

      // Validate component and attributes
      const Component = block.component;
      const resolvedName = block.attributes?.type;

      if (!Component) {
        console.error(`Block "${block.title}" is missing a component`);
        return;
      }

      if (!resolvedName) {
        console.error(`Block "${block.title}" is missing type attribute`);
        return;
      }

      // Create a fresh node structure
      const freshNode = {
        data: {
          type: Component,
          isCanvas: block.canvas || false,
          props: {
            ...block.attributes,
          },
          displayName: block.attributes?.displayName || block.title,
          nodes: [],
        },
      };

      // Parse and add the node
      const nodeToAdd = query.parseFreshNode(freshNode).toNode();
      const parentChildren = rootNode.data.nodes || [];
      const indexToInsert = parentChildren.length;

      add(nodeToAdd, "ROOT", indexToInsert);
      selectNode(nodeToAdd.id);
      setAddonBuilderState({ collapsed: false });
    } catch (error) {
      console.error(`Error adding block "${block.title}":`, error);
    }
  };

  /**
   * Handles drag end event for drag-and-drop block addition.
   * Collapses sidebar and selects the last added node.
   */
  const handleDragEnd = () => {
    try {
      const serializedNodes = query.getSerializedNodes();
      const nodeKeys = Object.keys(serializedNodes || {});
      const lastNodeId = nodeKeys[nodeKeys.length - 1];

      if (lastNodeId) {
        selectNode(lastNodeId);
      }
      setAddonBuilderState({ collapsed: true });
    } catch (error) {
      console.error("Error handling drag end:", error);
    }
  };

  return (
    <div
      ref={(ref) => handleCreateBlock(ref)}
      className="bg-gray-100 border-2 border-dashed h-22 border-gray-300 rounded-md px-1 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-150 flex flex-col items-center justify-center text-center opt-block-item"
      draggable
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      <div className="text-gray-800 text-lg flex items-center justify-center">
        {block.icon || (
          <span className="text-3xl font-bold text-gray-600 opt-block-item-icon">
            {block.title?.[0]?.toUpperCase() || "T"}
          </span>
        )}
      </div>
      <h4 className="text-base text-[#41454F] my-1.5! font-normal! line-clamp-2">
        {block.title}
      </h4>
    </div>
  );
};
