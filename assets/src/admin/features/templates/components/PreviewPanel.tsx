/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { ImagePlaceholderIcon } from "@/common/icons";
import { Button } from "@/shadcn/components/ui/button";
import { DynamicFieldRenderer } from "./DynamicFieldRenderer";
import type { RemoteTemplate } from "@/api/templates";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SelectedOptions = Record<string, string>;

interface PreviewPanelProps {
    template: RemoteTemplate | null;
    selectedOptions: SelectedOptions;
    onOptionChange: (key: string, value: string) => void;
    onUse: (template: RemoteTemplate) => void;
    creatingId: number | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function OptionLabel({ children }: { children: string }) {
    return (
        <p className="text-[11px] font-semibold text-gray-500 mb-2">
            {children}
        </p>
    );
}

// ─── Preview Panel ────────────────────────────────────────────────────────────

export function PreviewPanel({
    template,
    selectedOptions,
    onOptionChange,
    onUse,
    creatingId,
}: PreviewPanelProps) {
    const isCreating = template ? creatingId === template.id : false;
    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h3 className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                    { template?.title ?? __("Preview", "optiontics")}
                </h3>
                <div className="flex items-center gap-4">
                    {template && (
                        <Button
                            size="sm"
                            onClick={() => onUse(template)}
                            loading={isCreating}
                            disabled={isCreating}
                            variant="outlinePrimary"
                            className="h-7 text-xs cursor-pointer"
                        >
                            {__("Use This", "optiontics")}
                        </Button>
                    )}
                    {template?.preview_url && (
                        <a
                            href={template.preview_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-900 hover:text-[var(--opt-primary)] font-medium truncate max-w-[120px]"
                        >
                            {__("Live Preview", "optiontics")}
                        </a>
                    )}
                </div>
            </div>

            {template ? (
                <div className="flex flex-col flex-1 p-4 overflow-y-auto">
                    {/* Image area — placeholder when no image is available */}
                    <div className="w-full bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center" style={{ aspectRatio: "4/2" }}>
                       {template?.thumbnail ? (
                            <img src={template?.thumbnail} alt="" className="w-full h-full object-cover" />
                       ) : (
                           <ImagePlaceholderIcon className="w-12 h-12 text-gray-300" />
                        )}
                    </div>

                    {/* Dynamic option fields */}
                    <div className="flex flex-col gap-4 mt-4">
                        {(template.fields ?? []).map((field: any) => (
                            <div key={field.blockid ?? field.label}>
                                <OptionLabel>{field.label}</OptionLabel>
                                <DynamicFieldRenderer
                                    field={field}
                                    value={selectedOptions[field.label] ?? ""}
                                    onChange={(v) => onOptionChange(field.label, v)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-gray-400 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                        <ImagePlaceholderIcon className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                        {__("No template selected", "optiontics")}
                    </p>
                    <p className="text-xs text-gray-400">
                        {__("Click a template card to preview it here", "optiontics")}
                    </p>
                </div>
            )}
        </div>
    );
}
