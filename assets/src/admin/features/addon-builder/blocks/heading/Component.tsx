/**
 * External dependencies
 */
import { useNode } from "@craftjs/core";

/**
 * Internal dependencies
 */
import { BlockToolbox } from "../../components/BlockToolbox";
import { cn } from "@/shadcn/lib/utils";

export default function Component(props: any) {
    const { value, tag } = props;

    const {
        connectors: { connect },
        actions: { setProp },
        isActive,
    } = useNode((node) => ({
        isActive: node.events.selected,
    }));
    const Tag = tag;

    return (
        <div
            ref={(ref: any) => (ref ? connect(ref) : null)}
            className={cn(
                "relative border border-dashed border-transparent hover:border-gray-400 transition-all duration-300 rounded! p-1",
                isActive && "border-solid border-gray-400",
            )}
        >
            <BlockToolbox />
            <Tag
                contentEditable={true}
                dangerouslySetInnerHTML={{ __html: value || "" }}
                onBlur={(e: any) => {
                    setProp(
                        (prop: any) =>
                            (prop.value = (
                                e.currentTarget as HTMLDivElement
                            ).innerHTML),
                        500,
                    );
                }}
            ></Tag>
        </div>
    );
}
