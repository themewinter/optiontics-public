/**
 * WordPress dependencies
 */
import { ReactElement } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { ControlGeneratorProps } from "../../../types";
import { Option } from "../options";
import SwitchFieldOptionRow from "./OptionRow";
import SwitchFieldOptionHeader from "./OptionHeader";
import { useSwitchFieldOptionsMutations } from "./hooks/useOptionsMutations";

/**
 * Container component coordinating state and rendering for Options.
 * - Uses hooks for mutations and drag state (SRP: logic kept out of view layer)
 * - Composes header and row components (SoC: presentation vs. behavior)
 * 
 * Generic component that works for any option-based block (Radio, Dropdown, etc.)
 */
export default function SwitchFieldControl({
    attributes,
    setAttribute,
}: ControlGeneratorProps<any>): ReactElement {

    const options = (attributes && attributes.options ? attributes.options : []) as Option[];
    const { updateOption, uploadImage, removeImage, updateOptionFields } = useSwitchFieldOptionsMutations(options, setAttribute);
    return (
        <div className="flex flex-col gap-3 mt-3">
            <div className="bg-white rounded-lg border border-gray-200">
                {/* Header: presentation-only */}
                <SwitchFieldOptionHeader />

                {/* Options */}
                <div className="space-y-2">
                    {options.map((option, index) => (
                        <SwitchFieldOptionRow
                            key={index}
                            option={option}
                            index={index}
                            updateOption={updateOption}
                            uploadImage={uploadImage}
                            removeImage={removeImage}
                            updateOptionFields={updateOptionFields}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

