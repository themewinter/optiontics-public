/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { cn } from "@/shadcn/lib/utils";

import type { AIProviderDefinition, AIProviderId } from "../types";

import { ProviderIcon } from "./ProviderIcon";

interface ProviderCardProps {
    provider: AIProviderDefinition;
    selected: boolean;
    onSelect: (id: AIProviderId) => void;
}

export function ProviderCard({
    provider,
    selected,
    onSelect,
}: ProviderCardProps) {
    return (
        <div
            role="radio"
            onClick={() => onSelect(provider.id)}
            aria-checked={selected}
            className={cn(
                "flex flex-col rounded-xl border p-5 transition-all cursor-pointer",
                "focus-within:outline-none",
                selected
                    ? "border-indigo-400 bg-white shadow-sm ring-1 ring-indigo-400"
                    : "border-(--opt-border) bg-white hover:border-indigo-200 hover:shadow-sm",
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <ProviderIcon id={provider.id} />
                <span
                    className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        selected
                            ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200",
                    )}
                >
                    {selected && (
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    )}
                    {selected
                        ? __("Active", "optiontics")
                        : __("Inactive", "optiontics")}
                </span>
            </div>

            <p className="font-semibold text-base text-(--opt-text-default) m-0 mb-1 leading-tight"
              style={{
                 fontSize: "16px",
                  margin: "0 8px 0 0",
              }}
            >
                {provider.name}
            </p>
            <p className="text-sm leading-relaxed text-(--opt-text-tertiary) m-0 flex-1">
                {provider.description}
            </p>

            <button
                type="button"
                onClick={() => onSelect(provider.id)}
                className={cn(
                    "mt-4 w-full rounded-lg py-2 text-sm font-medium transition-colors focus:outline-none",
                    selected
                        ? "bg-slate-100 text-slate-400 cursor-default"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer",
                )}
                disabled={selected}
            >
                {selected
                    ? __("Selected", "optiontics")
                    : __("Select", "optiontics")}
            </button>
        </div>
    );
}
