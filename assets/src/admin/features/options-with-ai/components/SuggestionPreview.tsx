/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { ChevronDown } from "lucide-react";

/**
 * Internal dependencies
 */
import { cn } from "@/shadcn/lib/utils";
import type { AiField } from "../types";

const MAX_PREVIEW_FIELDS = 3;

interface SuggestionPreviewProps {
    fields: AiField[];
}

function DropdownField({ field }: { field: AiField }) {
    const first = field.options?.[0];
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-800">{field.label}</span>
            <div className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white text-sm text-gray-400 pointer-events-none select-none">
                <span>{first?.label ?? __("Select", "optiontics")}</span>
                <ChevronDown className="w-4 h-4 shrink-0" />
            </div>
        </div>
    );
}

function RadioField({ field }: { field: AiField }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-800">{field.label}</span>
            <div className="flex gap-1.5 flex-wrap">
                {field.options?.slice(0, 4).map((opt, i) => (
                    <span
                        key={i}
                        className={cn(
                            "px-3 py-1 text-xs rounded border pointer-events-none select-none",
                            i === 0
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-700 border-gray-300"
                        )}
                    >
                        {opt.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

function CheckboxField({ field }: { field: AiField }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-800">{field.label}</span>
            <div className="flex flex-col gap-1">
                {field.options?.slice(0, 3).map((opt, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-gray-700 pointer-events-none select-none"
                    >
                        <div className="w-3.5 h-3.5 border border-gray-400 rounded-sm shrink-0" />
                        <span className="flex-1">{opt.label}</span>
                        {opt.price > 0 && (
                            <span className="text-gray-400">+${opt.price}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ToggleField({ field }: { field: AiField }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-gray-800">{field.label}</span>
            <div className="w-9 h-5 bg-gray-200 rounded-full relative shrink-0 pointer-events-none">
                <div className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
            </div>
        </div>
    );
}

function FieldPreview({ field }: { field: AiField }) {
    const type = field.type;
    if (type === "select") return <DropdownField field={field} />;
    if (type === "radio") return <RadioField field={field} />;
    if (type === "checkbox") return <CheckboxField field={field} />;
    if (type === "toggle" || type === "switch") return <ToggleField field={field} />;
    return <DropdownField field={field} />;
}

export function SuggestionPreview({ fields }: SuggestionPreviewProps) {
    const visible = fields.slice(0, MAX_PREVIEW_FIELDS);
    const remaining = fields.length - visible.length;

    return (
        <div className="flex flex-col gap-3">
            {visible.map((field, i) => (
                <FieldPreview key={i} field={field} />
            ))}
            {remaining > 0 && (
                <span className="text-xs text-gray-400 select-none">
                    +{remaining} {__("more field", "optiontics")}{remaining > 1 ? "s" : ""}
                </span>
            )}
        </div>
    );
}
