/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Button } from "@/shadcn/components/ui/button";
import { cn } from "@/shadcn/lib/utils";
import { ImagePlaceholderIcon } from "@/common/icons";
import type { RemoteTemplate } from "@/api/templates";

interface TemplateCardProps {
    template: RemoteTemplate;
    isSelected: boolean;
    isCreating: boolean;
    onSelect: () => void;
    onUse: (e: React.MouseEvent) => void;
}

export function TemplateCard({
    template,
    isSelected,
    isCreating,
    onSelect,
    onUse,
}: TemplateCardProps) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onSelect}
            onKeyDown={(e) => e.key === "Enter" && onSelect()}
            className={cn(
                "flex flex-col rounded-md border overflow-hidden bg-white cursor-pointer",
                "transition-all duration-200 group",
                isSelected
                    ? "border-[var(--opt-primary)] shadow-md ring-1 ring-[var(--opt-primary)]"
                    : "border-gray-200 hover:shadow-md hover:border-gray-300"
            )}
        >
            {/* Thumbnail placeholder + hover overlay */}
            <div className="w-full aspect-4/3 bg-gray-100 overflow-hidden relative flex items-center justify-center">
                
                {template?.thumbnail ? (
                    <img
                        src={template?.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <ImagePlaceholderIcon
                        className="w-12 h-12 text-gray-300 absolute transition-opacity duration-200 group-hover:opacity-0"
                    />
                )}

                {/* Hover overlay with action buttons */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2">
                    <Button
                        size="sm"
                        onClick={onUse}
                        loading={isCreating}
                        disabled={isCreating}
                        className="w-full max-w-[120px] h-8 text-xs font-medium cursor-pointer"
                    >
                        {__("Use This", "optiontics")}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onSelect}
                        disabled={isCreating}
                        className="w-full max-w-[120px] h-8 text-xs font-medium cursor-pointer bg-white/90 hover:bg-white"
                    >
                        {__("View", "optiontics")}
                    </Button>
                </div>
            </div>

            {/* Card info */}
            <div className="p-4">
                <p className="text-sm font-semibold text-gray-900 truncate leading-tight mt-0! mb-2!">
                    {template.title}
                </p>
                <p className="text-xs text-gray-400 m-0!">
                    {(template.fields ?? []).length} {__("Options", "optiontics")}
                </p>
            </div>
        </div>
    );
}
