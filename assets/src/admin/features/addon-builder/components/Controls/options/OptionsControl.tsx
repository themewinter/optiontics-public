/**
 * WordPress dependencies
 */
import { ReactElement } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { Plus } from "lucide-react";

/**
 * Internal dependencies
 */
import { Button } from "@/shadcn/components/ui/button";
import { ControlGeneratorProps } from "../../../types";
import OptionsHeader from "./OptionsHeader";
import OptionRow from "./OptionRow";
import { useOptionsMutations } from "./hooks/useOptionsMutations";
import { useOptionsDrag } from "./hooks/useOptionsDrag";
import type { Option } from "./types";

/**
 * Container component coordinating state and rendering for Options.
 * - Uses hooks for mutations and drag state (SRP: logic kept out of view layer)
 * - Composes header and row components (SoC: presentation vs. behavior)
 * 
 * Generic component that works for any option-based block (Radio, Dropdown, etc.)
 */
export default function OptionsControl({
    attributes,
    setAttribute,
}: ControlGeneratorProps<any>): ReactElement {
    const options = (attributes && attributes.options ? attributes.options : []) as Option[];
    const blockType = attributes?.type || "";

    // Mutations (add/update/delete/toggle/upload)
    const {
        addOption,
        updateOption,
        updateOptionFields,
        deleteOption,
        toggleDefault,
        uploadImage,
        removeImage,
        setOptions,
    } = useOptionsMutations(options, setAttribute, blockType);

    // Drag state and reordering
    const {
        draggingIndex,
        overIndex,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    } = useOptionsDrag<Option>(options, setOptions);

    return (
        <div className="flex flex-col gap-2">
            <div className="bg-white rounded border border-gray-200">
                <div
                    className="text-sm font-semibold text-gray-900 px-3 py-3 border-b border-gray-300"
                >
                    {__("Option Values", "optiontics")}
                </div>
                {/* Header: presentation-only */}
                <OptionsHeader />

                {/* Options */}
                <div className="space-y-2">
                    {options.map((option, index) => (
                        <OptionRow
                            key={index}
                            option={option}
                            index={index}
                            dragging={draggingIndex === index}
                            over={overIndex === index}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragEnd={handleDragEnd}
                            updateOption={updateOption}
                            updateOptionFields={updateOptionFields}
                            toggleDefault={toggleDefault}
                            deleteOption={deleteOption}
                            uploadImage={uploadImage}
                            removeImage={removeImage}
                            blockType={blockType}
                        />
                    ))}
                </div>

                {/* Add New Option Button */}
                <Button
                    onClick={addOption}
                    size="sm"
                    variant="softPrimary"
                    className="m-3 opt-add-new-option-btn"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {__("Add New Option", "optiontics")}
                </Button>
            </div>
        </div>
    );
}

