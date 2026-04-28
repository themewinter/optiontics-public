/**
 * External dependencies
 */
import { useNode } from "@craftjs/core";

/**
 * Internal dependencies
 */
import { cn } from "@/shadcn/lib/utils";
import { BlockToolbox } from "../../components/BlockToolbox";
import { Option } from "../../components/Controls/options";
import { OptionItem } from "./components/OptionItem";
import { useOptions } from "./hooks/useOptions";
import { useOptionHandlers } from "./hooks/useOptionHandlers";

function Component(props: any) {
    const { label, desc, required } = props;

    const {
        connectors: { connect },
        isActive,
    } = useNode((node) => ({
        isActive: node.events.selected,
    }));

    const { nodeProps, options, update } = useOptions();
    const multiSelect = nodeProps.selection === "multiple";

    const handlers = useOptionHandlers(update, multiSelect);

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

            <div className="border border-gray-200 rounded-md p-2">
                <div className="flex flex-wrap gap-2">
                    {options.map((option: Option, index: number) => (
                        <OptionItem
                            key={index}
                            option={option}
                            index={index}
                            onSelect={handlers.select}
                            onDelete={handlers.remove}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Component;
