/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { SuggestionCard } from "./SuggestionCard";
import type { Suggestion } from "../types";

interface SuggestionGridProps {
    suggestions: Suggestion[];
    isCreating: string | null;
    onUseThis: (suggestion: Suggestion) => void;
}

export function SuggestionGrid({ suggestions, isCreating, onUseThis }: SuggestionGridProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="text-center">
                <p className="text-2xl! )] m-2!">
                    {__("Pick an option set to get started", "optiontics")}
                </p>
                <p className="text-sm text-gray-500 mb-0">
                    {__("Each suggestion is tailored to your products. Select one to open it in the editor, or refine below.", "optiontics")}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {suggestions.map((suggestion) => (
                    <SuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        isCreating={isCreating === suggestion.id}
                        isAnyCreating={!!isCreating}
                        onUseThis={onUseThis}
                    />
                ))}
            </div>
        </div>
    );
}
