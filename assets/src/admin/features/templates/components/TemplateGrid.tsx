/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { Search } from "lucide-react";

/**
 * Internal dependencies
 */
import { TemplateCard } from "./TemplateCard";
import type { RemoteTemplate } from "@/api/templates";

interface TemplateGridProps {
    templates: RemoteTemplate[];
    selectedId: number | null;
    creatingId: number | null;
    loading: boolean;
    error: boolean;
    onSelect: (template: RemoteTemplate) => void;
    onUse: (template: RemoteTemplate) => void;
}

function EmptyState() {
    return (
        <div className="col-span-3 flex flex-col items-center justify-center py-16 text-gray-400">
            <Search className="w-8 h-8 mb-3 opacity-40" />
            <p className="text-sm font-medium">
                {__("No templates found.", "optiontics")}
            </p>
            <p className="text-xs mt-1 opacity-70">
                {__("Try a different search term.", "optiontics")}
            </p>
        </div>
    );
}

function LoadingState() {
    return (
        <>
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col rounded-md border border-gray-200 overflow-hidden bg-white animate-pulse">
                    <div className="w-full aspect-[4/3] bg-gray-100" />
                    <div className="p-4 flex flex-col gap-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </>
    );
}

function ErrorState() {
    return (
        <div className="col-span-3 flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-sm font-medium">
                {__("Failed to load templates. Please try again.", "optiontics")}
            </p>
        </div>
    );
}

export function TemplateGrid({
    templates,
    selectedId,
    creatingId,
    loading,
    error,
    onSelect,
    onUse,
}: TemplateGridProps) {
    if (loading) {
        return <div className="grid grid-cols-3 gap-6"><LoadingState /></div>;
    }
    if (error) {
        return <div className="grid grid-cols-3 gap-6"><ErrorState /></div>;
    }
    return (
        <div className="grid grid-cols-3 gap-6">
            {templates.length === 0 ? (
                <EmptyState />
            ) : (
                templates.map((template) => (
                    <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={template.id === selectedId}
                        isCreating={creatingId === template.id}
                        onSelect={() => onSelect(template)}
                        onUse={(e) => {
                            e.stopPropagation();
                            onUse(template);
                        }}
                    />
                ))
            )}
        </div>
    );
}
