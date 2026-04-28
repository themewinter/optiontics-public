/**
 * Internal dependencies
 */
import { cn } from "@/shadcn/lib/utils";

// ─── Color name → hex map ────────────────────────────────────────────────────

export const COLOR_HEX_MAP: Record<string, string> = {
    Black:          "#1a1a1a",
    White:          "#f5f5f5",
    Gold:           "#d4a017",
    Silver:         "#b0b0b0",
    "Rose Gold":    "#b76e79",
    Navy:           "#1a2e4a",
    Blue:           "#3b82f6",
    Red:            "#ef4444",
    Pink:           "#ec4899",
    Clear:          "#dbeafe",
    Tortoise:       "#8b5e3c",
    Brown:          "#78350f",
    Purple:         "#7c3aed",
    Green:          "#16a34a",
    "Natural Wood": "#c8a165",
    "Dark Walnut":  "#4a3728",
    Tinted:         "#6b7280",
    Polarized:      "#374151",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColorNameSelectorProps {
    options: string[];
    selected: string;
    onSelect: (color: string) => void;
}

// ─── Color swatches (color-swatch blocks) ────────────────────────────────────

export function ColorNameSelector({ options, selected, onSelect }: ColorNameSelectorProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((name) => {
                const hex = COLOR_HEX_MAP[name] ?? "#9ca3af";
                return (
                    <button
                        key={name}
                        type="button"
                        onClick={() => onSelect(name)}
                        style={{ backgroundColor: hex }}
                        title={name}
                        className={cn(
                            "w-6 h-6 rounded-full border-2 transition-all duration-150",
                            selected === name
                                ? "border-gray-900 scale-110 shadow-md ring-1 ring-offset-1 ring-gray-900"
                                : "border-transparent hover:border-gray-400 hover:scale-105"
                        )}
                    />
                );
            })}
        </div>
    );
}
