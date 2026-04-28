import { CustomSwitch } from "@/common/components/form";
import { Input } from "@/shadcn/components/ui";
import { OptionPrice } from "../../../components/OptionPrice";
import { If } from "@/common/components/If";
import { __ } from "@wordpress/i18n";

export const OptionItem = ({
    option,
    index,
    nodeProps,
    styles,
    handlers,
    calculatePercentage,
    quantity,
    renderId
}: any) => {
    
    // Generate a unique name for this switch input per render + index
    const uniqueName = `switch-toggle-${option.value?.replace(/\s+/g, "-") || "option"}-${renderId}-${index}`;

    return (
        <>
            <CustomSwitch
                name={uniqueName}
                checked={option.default || false}
                onChange={(checked: boolean) => {
                    handlers.toggle(checked);
                }}
                image={option.image}
                imageStyle={{
                    width: `${styles.width.val}px`,
                    height: `${styles.height.val}px`,
                    borderRadius: `${styles.radius.val}px`,
                    marginRight: `${styles.mrR.val}px`,
                }}
                label={
                    option.value ||
                    __("Toggle switch", "optiontics")
                }
            />

            <span className="text-sm text-gray-500 ml-2">
                <OptionPrice option={option} calculatePercentage={calculatePercentage} />
            </span>

            <If condition={nodeProps.isQuantity}>
                <Input
                    value={quantity}
                    onChange={(e) => handlers.updateQuantity?.(Number(e.target.value))}
                    min={nodeProps.min}
                    max={nodeProps.max}
                    className="w-12! h-7 text-sm border border-gray-300 rounded px-1 text-center"
                    type="number"
                />
            </If>
        </>
    );
};

