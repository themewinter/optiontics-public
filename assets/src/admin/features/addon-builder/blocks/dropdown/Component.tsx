/**
 * Wordpress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/components/ui/select";
import { useEditor, useNode } from "@craftjs/core";
import { BlockToolbox } from "../../components/BlockToolbox";
import { cn } from "@/shadcn/lib/utils";
import { OptionItem } from "./components/OptionItem";
import { useOptions } from "./hooks/useOptions";
import { useOptionHandlers } from "./hooks/useOptionHandlers";
import { calculatePercentage } from "../../utils";
import { Option } from "../../components/Controls/options";

function Component(props: any) {
    const { label, desc, required } = props;

    const {
        connectors: { connect },
        isActive,
        id,
    } = useNode((node) => ({
        isActive: node.events.selected,
        id: node.id,
    }));

    const { nodeProps, options, update } = useOptions();
    const {
        actions: { selectNode },
    } = useEditor();
    const handlers = useOptionHandlers(update);
    const styles = nodeProps._styles || {};

    const selectedValue =
        options.find((opt: Option) => !!opt.default)?.value || "";

    const handleSelectNode = () => {
        selectNode(id);
    };

    return (
        <div
            ref={(ref) => ref && connect(ref)}
            className={cn(
                "flex flex-col gap-2 relative border border-dashed border-transparent rounded p-1",
                "hover:border-gray-400 transition-all duration-300",
                isActive && "border-solid border-gray-400",
            )}
        >
            <BlockToolbox />

            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {desc && <p className="text-sm text-gray-500 my-1">{desc}</p>}

            <div className="space-y-2">
                <Select
                    value={selectedValue}
                    onValueChange={(value) => {
                        const index = options.findIndex(
                            (opt: Option) => opt.value === value,
                        );
                        if (index !== -1) {
                            handlers.select(index);
                        }
                    }}
                >
                    <SelectTrigger
                        className="w-full h-9 rounded border border-gray-300 text-sm"
                        onClick={handleSelectNode}
                    >
                        <SelectValue
                            placeholder={__("Select an option", "optiontics")}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option: Option, index: number) => (
                            <OptionItem
                                key={index}
                                option={option}
                                styles={styles}
                                calculatePercentage={calculatePercentage}
                            />
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

export default Component;
