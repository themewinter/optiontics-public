import { cn } from "@/shadcn/lib/utils";
import { BlockToolbox } from "../../components/BlockToolbox";
import { OptionItem } from "./components/OptionItem";
import { useOptions } from "./hooks/useOptions";
import { useOptionHandlers } from "./hooks/useOptionHandlers";
import { calculatePercentage } from "../../utils";
import { useNode } from "@craftjs/core";
import { Option } from "../../components/Controls/options";
import { useMemo } from "@wordpress/element";

function Component(props: any) {
    const { label, desc, required } = props;

    const {
        connectors: { connect },
        actions: { setProp },
        isActive
    } = useNode(node => ({
        isActive: node.events.selected
    }));

    const { nodeProps, options, update } = useOptions();
    const handlers = useOptionHandlers(update);
    const styles = nodeProps._styles || {};

    // Handle quantity update at nodeProps level
    const updateQuantity = (quantity: number) => {
        setProp((prev: any) => {
            prev.quantity = quantity;
            return prev;
        });
    };

    const quantity = nodeProps.quantity || 1;
    
    // Generate a unique renderId for this render pass
    const renderId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

    return (
        <div
            ref={ref => ref && connect(ref)}
            className={cn(
                "flex flex-col gap-2 relative border border-dashed border-transparent rounded p-1",
                "hover:border-gray-400 transition-all duration-300",
                isActive && "border-solid border-gray-400"
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

            <div className="flex items-center gap-2">
                {options.map((option: Option, index: number) => (
                    <OptionItem
                        key={option.value || `option-${index}`}
                        option={option}
                        index={index}
                        nodeProps={nodeProps}
                        styles={styles}
                        handlers={{ ...handlers, updateQuantity }}
                        calculatePercentage={calculatePercentage}
                        quantity={quantity}
                        renderId={renderId}
                    />
                ))}
            </div>
        </div>
    );
}

export default Component;
