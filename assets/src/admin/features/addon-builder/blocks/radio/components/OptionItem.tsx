import { RadioGroupItem } from "@/shadcn/components/ui/radio-group";
import { Input, Label } from "@/shadcn/components/ui";
import { Trash2 } from "lucide-react";
import { Button } from "@/shadcn/components/ui/button";
import { OptionPrice } from "../../../components/OptionPrice";
import { If } from "@/common/components/If";

export const OptionItem = ({
    option,
    index,
    nodeProps,
    styles,
    handlers,
    calculatePercentage,
}: any) => {
    return (
        <div className="flex items-center justify-between px-3 group">
            <div className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem
                    value={option.value}
                    id={`radio-${index}`}
                    aria-label={option.value}
                />

                <Label htmlFor={`radio-${index}`} className="font-normal">
                    <If condition={option.image}>
                        <img
                            src={option.image}
                            alt={option.value}
                            style={{
                                width: `${styles.width.val}px`,
                                height: `${styles.height.val}px`,
                                borderRadius: `${styles.radius.val}px`,
                                marginRight: `${styles.mrR.val}px`,
                            }}
                            className="rounded-md size-10"
                        />
                    </If>
                    <span className="text-sm text-gray-800">
                        {option.value}
                    </span>

                    <span className="text-sm text-gray-500 ml-2">
                        <OptionPrice
                            option={option}
                            calculatePercentage={calculatePercentage}
                        />
                    </span>
                </Label>
            </div>

            <div className="flex gap-2">
                <If condition={nodeProps.isQuantity}>
                    <Input
                        value={option.quantity || 1}
                        type="number"
                        min={nodeProps.min}
                        max={nodeProps.max}
                        className="w-14 pr-0! pl-1.5! h-7 text-sm text-center"
                        onChange={(e) =>
                            handlers.updateQuantity(
                                index,
                                Number(e.target.value),
                            )
                        }
                    />
                </If>

                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 group-hover:bg-neutral-200 transition-opacity duration-300 opt-option-delete-btn"
                    onClick={() => handlers.remove(index)}
                >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                </Button>
            </div>
        </div>
    );
};
