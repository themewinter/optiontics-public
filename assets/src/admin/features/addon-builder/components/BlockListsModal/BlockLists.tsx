/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useMemo } from "@wordpress/element";

/**
 * External dependencies
 */
import { cn } from "@/shadcn/lib/utils";

/**
 * Internal dependencies
 */
import { blockLists } from "../../constant";
import { BlockItem } from "./BlockItem";

/**
 * Empty state component when no blocks match the search query.
 */
const EmptyState = () => (
    <div className="col-span-2 flex flex-col items-center justify-center py-8 text-muted-foreground text-center">
        <span className="text-3xl mb-2" role="img" aria-label="search">
            🧐
        </span>
        <span>{__("No blocks found.", "optiontics")}</span>
    </div>
);

/**
 * Sidebar for displaying available blocks in the Craft.js editor.
 * Provides search functionality and displays filtered block items.
 */
const BlockLists = () => {
    /**
 * Filter out "body" blocks and apply search filter.
 * Memoized to prevent unnecessary recalculations.
 */
    const filteredBlocks = useMemo(() => {
        // Filter out body blocks
        let blocks = blockLists.filter(
            (block) => !block.tags?.includes("body"),
        );
        return blocks;
    }, []);

    const blockListClasses = cn(
        "grid grid-cols-4 gap-2",
        "transition-all duration-300",
    );

    return (
        <>
            <div className={blockListClasses}>
                {filteredBlocks.length === 0 ? (
                    <EmptyState />
                ) : (
                    filteredBlocks.map((block) => (
                        <BlockItem
                            key={`${block.attributes?.type || block.title}`}
                            block={block}
                        />
                    ))
                )}
            </div>
        </>
    );
};

export default BlockLists;
