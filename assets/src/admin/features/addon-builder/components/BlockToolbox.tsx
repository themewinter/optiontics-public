/**
 * Wordpress dependencies
 */
import React from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import {
	Copy as CopyIcon,
	Move as MoveIcon,
	Trash as TrashIcon,
} from "lucide-react";
import useToolboxLogic from "../hooks/useToolboxLogic";
import { If } from "@/common/components/If";
import { ColumnsIcon, SplitColumnIcon } from "@/common/icons";

/**
 * BlockToolbox Component
 *
 * Renders a toolbox inside each block when the block is active or hovered.
 * Provides move, duplicate, and delete actions for block manipulation.
 */
export const BlockToolbox: React.FC = () => {
	const {
		isActive,
		isHover,
		id,
		actions,
		name,
		moveable,
		deletable,
		drag,
		duplicateNode,
		props,
	} = useToolboxLogic();

	// When the node is the body, do NOT render the toolbox.
	// The "Body" node can be identified by its name being "Body".
	const isBody = name === "Body";

	// Only show toolbox when block is active or hovered, and not for Body
	if ((!isActive && !isHover) || isBody) {
		return null;
	}
	if (!isActive && isHover) {
		return null;
	}
	return (
		<div className="px-3 py-2 rounded text-white bg-gray-800 absolute top-[-36px] right-[calc(100%-360px)] flex items-center gap-2.5 z-50 opt-toolbox">
			<h4 className="text-xs! font-medium! text-white! my-0!">{name}</h4>
			<If condition={moveable}>
				<span
					className="inline-flex items-center justify-center cursor-grab active:cursor-grabbing"
					ref={(dom: HTMLElement | null) => {
						if (dom) {
							drag(dom);
						}
					}}
					role="button"
					tabIndex={0}
					aria-label={__("Move block", "optiontics")}
				>
					<MoveIcon className="size-3" />
				</span>
			</If>
			<If condition={props?.columns}>
				<span
					className="inline-flex items-center justify-center cursor-pointer hover:text-blue-400 transition-colors"
					onClick={() =>
						actions.setProp(id, (props: any) => {
							props.columns = props.columns === 1 ? 2 : 1;
						})
					}
					role="button"
					tabIndex={0}
					aria-label={__("Set columns to 2", "optiontics")}
				>
					{props.columns === 1 ? <ColumnsIcon /> : <SplitColumnIcon />}
				</span>
			</If>
			<If condition={deletable}>
				<span
					className="inline-flex items-center justify-center cursor-pointer hover:text-red-400 transition-colors"
					onClick={() => actions.delete(id)}
					role="button"
					tabIndex={0}
					aria-label={__("Delete block", "optiontics")}
				>
					<TrashIcon className="size-3" />
				</span>
				<span
					className="inline-flex items-center justify-center cursor-pointer hover:text-blue-400 transition-colors"
					onClick={duplicateNode}
					role="button"
					tabIndex={0}
					aria-label={__("Duplicate block", "optiontics")}
				>
					<CopyIcon className="size-3" />
				</span>
			</If>
		</div>
	);
};
