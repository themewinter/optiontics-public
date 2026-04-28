/**
 * WordPress dependencies
 */
import { ReactElement } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { ControlGeneratorProps } from "../../../types";
import { Option } from "../options";
import PriceTypeOptionHeader from "./OptionHeader";
import PriceTypeOptionRow from "./OptionRow";

export default function PriceTypeControl({
    attributes,
    setAttribute,
}: ControlGeneratorProps<any>): ReactElement {
    const options = (
        attributes && attributes.options ? attributes.options : []
    ) as Option[];

    const updateOption = (index: number, field: keyof Option, value: any) => {
        const updatedOptions = [...options];
        updatedOptions[index] = {
            ...updatedOptions[index],
            [field]: value,
        } as Option;
        setAttribute("options", updatedOptions);
    };

    const updateOptionFields = (index: number, updates: Partial<Option>) => {
        const updatedOptions = [...options];
        updatedOptions[index] = {
            ...updatedOptions[index],
            ...updates,
        } as Option;
        setAttribute("options", updatedOptions);
    };

    return (
        <div className="flex flex-col gap-3 mt-3">
            <div className="bg-white rounded-lg border border-gray-200">
                {/* Header: presentation-only */}
                <PriceTypeOptionHeader />

                {/* Options */}
                <div className="space-y-2">
                    {options.map((option, index) => (
                        <PriceTypeOptionRow
                            key={index}
                            index={index}
                            option={option}
                            updateOption={updateOption}
                            updateOptionFields={updateOptionFields}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
