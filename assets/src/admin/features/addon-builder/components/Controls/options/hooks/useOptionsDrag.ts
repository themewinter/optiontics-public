import { useRef, useState } from "@wordpress/element";

/**
 * Encapsulates drag-and-drop state and handlers for reordering option rows.
 * Single Responsibility: manage DnD indices and compute reordered arrays.
 * 
 * Generic hook that works with any item type for drag and drop functionality.
 */
export function useOptionsDrag<T>(
    items: T[],
    onReorder: (reordered: T[]) => void
) {
    const dragIndexRef = useRef<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);

    const handleDragStart = (index: number, e: React.DragEvent) => {
        dragIndexRef.current = index;
        setDraggingIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(index));
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setOverIndex(index);
    };

    const handleDrop = (index: number, e: React.DragEvent) => {
        e.preventDefault();
        const from =
            dragIndexRef.current !== null
                ? dragIndexRef.current
                : Number(e.dataTransfer.getData("text/plain"));
        if (Number.isFinite(from) && from !== index) {
            const reordered = [...items];
            const safeFrom = from as number;
            const moved = reordered[safeFrom];
            if (typeof moved === "undefined") {
                cleanup();
                return;
            }
            reordered.splice(safeFrom, 1);
            reordered.splice(index, 0, moved);
            onReorder(reordered);
        }
        cleanup();
    };

    const handleDragEnd = () => cleanup();

    const cleanup = () => {
        dragIndexRef.current = null;
        setDraggingIndex(null);
        setOverIndex(null);
    };

    return {
        draggingIndex,
        overIndex,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    };
}

