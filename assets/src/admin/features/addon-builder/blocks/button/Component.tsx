/**
 * External dependencies
 */
import { Button } from "@/shadcn/components/ui/button";
import { useNode } from "@craftjs/core";
import { Trash2 } from "lucide-react";
import { Option } from "../../components/Controls/options/types";
import { If } from "@/common/components/If";
import { cn } from "@/shadcn/lib/utils";
import { BlockToolbox } from "../../components/BlockToolbox";
import { Price } from "@/common/components/price";

function Component(props: any) {
    const { label, desc, required } = props;

    const {
        connectors: { connect },
        actions: { setProp },
        props: nodeProps = {},
        isActive,
    } = useNode((node) => ({
        props: node.data.props,
        isActive: node.events.selected,
    }));

    const options = (nodeProps.options ? nodeProps.options : []) as Option[];
    const vertical = nodeProps.vertical || false;
    const deleteOption = (index: number) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setProp((prev: any) => (prev["options"] = updatedOptions));
    };

    const selectOption = (index: number) => {
        const updatedOptions = options.map((opt, i) => ({
            ...opt,
            default: i === index ? !opt.default : false,
        }));
        setProp((prev: any) => (prev["options"] = updatedOptions));
    };

    return (
        <div
            ref={(ref: any) => (ref ? connect(ref) : null)}
            className={cn(
                "flex flex-col gap-2 relative border border-dashed border-transparent hover:border-gray-400 transition-all duration-300 rounded! p-1",
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
            {desc && <p className="text-sm text-gray-500 my-1!">{desc}</p>}

            <div className="space-y-2 border border-gray-200 rounded-md p-2">
                {(() => {
                    const safeOptions =
                        options && options.length > 0
                            ? options
                            : [];

                    return (
                        <div
                            className={cn("flex gap-2 flex-wrap", {
                                "flex-col": vertical,
                            })}
                        >
                            {safeOptions.map((option: any, index: number) => {
                                const isFree =
                                    option.type === "no_cost" ||
                                    option.regular === "Free";
                                const hasSale =
                                    !isFree &&
                                    option.sale &&
                                    String(option.sale).trim() !== "";
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center justify-start px-3 gap-1 relative group w-fit"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant={
                                                    option.default
                                                        ? "default"
                                                        : "softPrimary"
                                                }
                                                onClick={() =>
                                                    selectOption(index)
                                                }
                                                className={cn(
                                                    "flex items-center gap-1 rounded-full border-none",
                                                    {
                                                        "text-white":
                                                            option.default,
                                                    },
                                                )}
                                            >
                                                <span
                                                    className={cn("text-sm", {
                                                        "text-white":
                                                            option.default,
                                                        "text-gray-800":
                                                            !option.default,
                                                    })}
                                                >
                                                    {option.value}
                                                </span>
                                                <If
                                                    condition={
                                                        !isFree && hasSale
                                                    }
                                                >
                                                    <span
                                                        className={cn(
                                                            "text-sm text-gray-500 ml-2",
                                                            {
                                                                "text-white":
                                                                    option.default,
                                                                "text-gray-800":
                                                                    !option.default,
                                                            },
                                                        )}
                                                    >
                                                        <Price className="line-through mr-1" price={option.regular} />
                                                        <Price price={option.sale} />
                                                    </span>
                                                </If>
                                                <If
                                                    condition={
                                                        !isFree && !hasSale
                                                    }
                                                >
                                                    <span
                                                        className={cn(
                                                            "text-sm text-gray-500 ml-2",
                                                            {
                                                                "text-white":
                                                                    option.default,
                                                                "text-gray-800":
                                                                    !option.default,
                                                            },
                                                        )}
                                                    >
                                                        <Price price={option.regular} />
                                                    </span>
                                                </If>
                                            </Button>
                                        </div>
                                        <div
                                            className="flex items-center gap-2 absolute -right-2.5 -top-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-100 rounded p-1 cursor-pointer"
                                            onClick={() => deleteOption(index)}
                                        >
                                            <Trash2 className="w-4 h-4 cursor-pointer text-red-500" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

export default Component;
