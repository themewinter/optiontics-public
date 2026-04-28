/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Button } from "@/shadcn/components/ui/button";
import { Badge } from "@/shadcn/components/ui/badge";
import { If } from "@/common/components/If";
import { SuggestionPreview } from "./SuggestionPreview";
import type { Suggestion } from "../types";

interface SuggestionCardProps {
    suggestion: Suggestion;
    isCreating: boolean;
    isAnyCreating: boolean;
    onUseThis: (suggestion: Suggestion) => void;
}

export function SuggestionCard({
    suggestion,
    isCreating,
    isAnyCreating,
    onUseThis,
}: SuggestionCardProps) {
    return (
        <div className="flex flex-col gap-4 p-5 rounded-xl border border-gray-200 bg-white">
            <div className="relative w-full">
                <If condition={!!suggestion.badge}>
                    <Badge
                        variant="default"
                        className="absolute top-[-14px] right-[-12px] text-xs bg-primary text-white px-3 py-1"
                    >
                        {suggestion.badge}
                    </Badge>
                </If>
                <p className="font-semibold text-gray-900 text-sm mb-0 ">
                    {suggestion.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 mb-0 line-clamp-2">
                    {suggestion.description}
                </p>
            </div>

            <SuggestionPreview fields={suggestion.fields} />

            <Button
                size="sm"
                className="w-full mt-auto rounded-[6px]"
                variant={suggestion.badge ? "default" : "outlinePrimary"}
                onClick={() => onUseThis(suggestion)}
                loading={isCreating}
                disabled={isAnyCreating}
            >
                {__("Use this", "optiontics")}
            </Button>
        </div>
    );
}
