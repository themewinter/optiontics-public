/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useRef } from "@wordpress/element";
import type { ReactNode } from "@wordpress/element";

/**
 * External dependencies
 */
import { useNavigate } from "react-router-dom";
import { Copy, Trash2 } from "lucide-react";

/**
 * Internal dependencies
 */
import useBuilderApi from "@/admin/features/addon-builder/hooks/useBuilderApi";
import { DeleteConfirmationDialog } from "@/common/components/DeleteConfirmationDialog";
import { EyeIcon } from "@/common/icons/EyeIcon";
import { EditIcon } from "@/common/icons/EditIcon";
import { MoreIcon } from "@/common/icons/MoreIcon";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/shadcn/components/ui/tooltip";

function ActionIconBtn({
	children,
	title,
	onClick,
	className,
	disabled,
	...props
}: {
	children: ReactNode;
	title?: string;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
	[key: string]: any;
}) {
	return (
		<button
			type="button"
			title={title}
			onClick={onClick}
			disabled={disabled}
			className={`flex items-center justify-center transition-colors px-2 hover:var(--opt-action-btn-hover) duration-150 ${disabled ? " cursor-not-allowed" : " cursor-pointer"}${className ? ` ${className}` : ""}`}
			style={{
				width: 36,
				height: 36,
				backgroundColor: "var(--opt-action-btn-bg)",
				borderRadius: '8px',
				opacity: disabled ? 0.6 : 1,
			}}
			{...props}
		>
			{children}
		</button>
	);
}

export const Action = ({ record }: { record: any }) => {
	const navigate = useNavigate();
	const { deleteOption, cloneOption } = useBuilderApi();
	const deleteTriggerRef = useRef<HTMLButtonElement>(null);

	const handleEdit = () => navigate(`/update/${record?.id}`);
	const handleDelete = async () => deleteOption(Number(record?.id));
	const handleClone = async () => cloneOption(Number(record?.id));
	const isPublished   = record?.status === "publish";
    const hasPreviewUrl = !!record?.preview_url;
    const previewEnabled = isPublished && hasPreviewUrl;

    const previewTooltip = !isPublished
        ? __("Publish this option first to preview it", "optiontics")
        : !hasPreviewUrl
            ? __("No product is assigned to this option yet.", "optiontics")
            : "Preview this option";

			


	return (
		<div className="flex items-center justify-end gap-1.5">
			<Tooltip>
				<TooltipTrigger asChild>
					<span className="inline-flex">
						<ActionIconBtn
							disabled={!previewEnabled}
							onClick={() => previewEnabled && window.open(record.preview_url, "_blank", "noopener,noreferrer")}
						>
							<EyeIcon />
						</ActionIconBtn>
					</span>
				</TooltipTrigger>
				{previewTooltip && (
					<TooltipContent side="bottom">
						{previewTooltip}
					</TooltipContent>
				)}
			</Tooltip>
			<ActionIconBtn
				title={__("Edit", "optiontics")}
				onClick={handleEdit}
				className="opt-options-list-edit-btn"
			>
				<EditIcon/>
			</ActionIconBtn>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						title={__("More actions", "optiontics")}
						className="flex items-center justify-center px-2 transition-colors duration-150 cursor-pointer hover:var(--opt-action-btn-hover)"
						style={{
							width: 36,
							height: 36,
							backgroundColor: "var(--opt-action-btn-bg)",
							color: "var(--opt-action-btn-color)",
							borderRadius: '8px'
						}}
					>
						<MoreIcon/>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-[140px]">
					<DropdownMenuItem
						className="gap-2 cursor-pointer opt-options-list-clone-btn"
						onClick={handleClone}
					>
						<Copy className="size-4" />
						{__("Clone", "optiontics")}
					</DropdownMenuItem>
					{/* TODO: Add export feature */}
					{/* <DropdownMenuItem
						className="gap-2 cursor-pointer"
						onClick={() => console.log("Export", record?.id)}
					>
						<Upload className="size-4" />
						{__("Export", "optiontics")}
					</DropdownMenuItem> */}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						className="gap-2 cursor-pointer opt-options-list-delete-btn"
						onClick={() => deleteTriggerRef.current?.click()}
					>
						<Trash2 className="size-4" />
						{__("Delete", "optiontics")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<DeleteConfirmationDialog
				onConfirm={handleDelete}
				title={__("Delete Addon", "optiontics")}
				description={__(
					"Are you sure you want to delete this addon?",
					"optiontics",
				)}
				trigger={
					<button
						ref={deleteTriggerRef}
						type="button"
						style={{ display: "none" }}
					/>
				}
			/>
		</div>
	);
};

export default Action;
