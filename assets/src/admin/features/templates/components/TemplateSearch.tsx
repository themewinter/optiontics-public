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
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/shadcn/components/ui/input-group";

interface TemplateSearchProps {
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
}

export function TemplateSearch({ value, onChange, onFocus }: TemplateSearchProps) {
    return (
        <InputGroup className="rounded! my-2 [&:has([data-slot=input-group-control]:focus-visible)]:border-[var(--opt-primary)] [&:has([data-slot=input-group-control]:focus-visible)]:ring-[var(--opt-primary)]/20">
            <InputGroupInput
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                placeholder={__("Enter template name", "optiontics")}
                className="text-sm"
            />
            <InputGroupAddon>
                <Search className="h-4 w-4 text-gray-400" />
            </InputGroupAddon>
        </InputGroup>
    );
}
