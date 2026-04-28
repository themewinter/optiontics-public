/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/shadcn/components/ui";

export const ConditionSelector: React.FC<{
    visibility: "show" | "hide";
    match: "any" | "all";
    onVisibilityChange: (value: "show" | "hide") => void;
    onMatchChange: (value: "any" | "all") => void;
}> = ({ visibility, match, onVisibilityChange, onMatchChange }) => (
    <div className="flex items-center gap-2 flex-wrap">
        <Select value={visibility} onValueChange={onVisibilityChange}>
            <SelectTrigger className="h-9! rounded! border border-gray-300 text-sm w-auto min-w-26">
                <SelectValue placeholder={__("Select Visibility", "optiontics")} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="show">{__("Show", "optiontics")}</SelectItem>
                <SelectItem value="hide">{__("Hide", "optiontics")}</SelectItem>
            </SelectContent>
        </Select>

        <span className="text-sm text-gray-700">
            {__("this field if", "optiontics")}
        </span>

        <Select value={match} onValueChange={onMatchChange}>
            <SelectTrigger className="h-9! rounded! border border-gray-300 text-sm w-26 min-w-26">
                <SelectValue placeholder={__("Select Match", "optiontics")} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="any">{__("Any", "optiontics")}</SelectItem>
                <SelectItem value="all">{__("All", "optiontics")}</SelectItem>
            </SelectContent>
        </Select>

        <span className="text-sm text-gray-700">
            {__("of these rules match:", "optiontics")}
        </span>
    </div>
);
