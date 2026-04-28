/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from "@wordpress/i18n";
import { useState } from "@wordpress/element";

/**
 * External dependencies
 */
import { AlignJustify, ChevronsUpDown } from "lucide-react";

/**
 * Internal dependencies
 */
import { ControlGeneratorProps } from "../../../types";
import OptionsModal from "./OptionsModal";
import type { Option } from "./types";

/**
 * Compact sidebar trigger for the option values modal.
 *
 * Shows a summary pill ("3 options added") and opens the full
 * Manage Items modal on click. Replaces the inline OptionsControl
 * for Radio, Checkbox, and Dropdown blocks.
 */
export default function OptionsControlCompact({
    attributes,
    setAttribute,
}: ControlGeneratorProps<any>) {
    const [open, setOpen] = useState(false);
    const options = (attributes?.options ?? []) as Option[];
    const count = options.length;

    const summary = count === 0
        ? __("No options added", "optiontics")
        : sprintf(
              /* translators: %d: number of options */
              _n("%d option added", "%d options added", count, "optiontics"),
              count
          );

    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700 my-1!">
                {__("Option Values", "optiontics")}
            </p>

            {/* Trigger pill */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:border-primary hover:bg-gray-50 transition-colors cursor-pointer"
            >
                <span className="flex items-center gap-2">
                    <AlignJustify className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{summary}</span>
                </span>
                <ChevronsUpDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>

            <OptionsModal
                open={open}
                onClose={() => setOpen(false)}
                attributes={attributes}
                setAttribute={setAttribute}
            />
        </div>
    );
}
