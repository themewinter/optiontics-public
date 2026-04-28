/**
 * Wordpress dependencies
 */
import { useDispatch, useSelect } from "@wordpress/data";

/**
 * External dependencies
 */
import { Plus } from "lucide-react";

/**
 * Internal dependencies
 */
import { stores } from "@/globalConstant";
import { Button } from "@/shadcn/components/ui";
import { cn } from "@/shadcn/lib/utils";
import { useNode } from "@craftjs/core";
import { If } from "@/common/components";

export default function Body(props: any) {
    const {
        background,
        color,
        minHeight,
        minWidth,
        width,
        children,
        padding,
        ...rest
    } = props;

    const {
        connectors: { connect, drag },
    } = useNode();

    const { setAddonBuilderState } = useDispatch(stores?.addons);

    const { collapsed } = useSelect((select) =>
        select(stores?.addons).getAddonBuilderState(),
    );

    const toggleCollapsed = () => {
        setAddonBuilderState({ collapsed: !collapsed });
    };

    return (
        <div
            ref={(ref) => {
                if (ref) connect(drag(ref));
            }}
            style={{
                background,
                color,
                minHeight,
                width: width.size + width.unit,
                minWidth,
                padding: "6px",
                transition: "all 0.2s linear",
                boxSizing: "border-box",
                border: "1px dashed lightgray",
                borderRadius: "6px",
                display:"flex",
                flexDirection:"column",
                gap:"10px",
            }}
            className={cn(
                !!children ? "block" : "flex items-center justify-center",
            )}
            {...rest}
        >
            <If condition={!children}>
				<Button
					size="icon"
					onClick={toggleCollapsed}
					className="opt-add-blocks-btn"
				>
					<Plus className="size-4" />
				</Button>
			</If>
            {children}
        </div>
    );
}
