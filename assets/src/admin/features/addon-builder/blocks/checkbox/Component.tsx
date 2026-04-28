import { cn } from "@/shadcn/lib/utils";
import { BlockToolbox } from "../../components/BlockToolbox";
import { OptionItem } from "./components/OptionItem";
import { useOptions } from "./hooks/useOptions";
import { useOptionHandlers } from "./hooks/useOptionHandlers";
import { calculatePercentage } from "../../utils";
import { useNode } from "@craftjs/core";
import { Option } from "../../components/Controls/options";

function Component(props: any) {
    const { label, desc, required, columns } = props;

    const {
        connectors: { connect },
        isActive,
    } = useNode((node) => ({
        isActive: node.events.selected,
    }));

    const { nodeProps, options, update } = useOptions();
    const handlers = useOptionHandlers(update);
    const styles = nodeProps._styles || {};

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

            <div
                className={cn(
                    "grid gap-2 border border-gray-200 rounded-md p-2",
                    columns === 2 ? "grid-cols-2" : "grid-cols-1",
                )}
            >
                {options.map((option: Option, index: number) => (
                    <OptionItem
                        key={index}
                        option={option}
                        index={index}
                        nodeProps={nodeProps}
                        styles={styles}
                        handlers={handlers}
                        calculatePercentage={calculatePercentage}
                    />
                ))}
            </div>
        </div>
    );
}

export default Component;
