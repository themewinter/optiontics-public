/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { select, useSelect } from "@wordpress/data";

/**
 * External dependencies
 */
import { ChevronDownIcon } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Internal dependencies
 */
import { Button } from "@/shadcn/components/ui";
import { ButtonGroup } from "@/shadcn/components/ui/button-group";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import { stores } from "@/globalConstant";
import useBuilderApi from "../../hooks/useBuilderApi";
import { useEditor } from "@craftjs/core";
import { If } from "@/common/components";
import { craftJsToBackend } from "../../utils";
import { ADDON_LIST_PATH } from "@/admin/router/routeDefinition";
import { DeleteConfirmationDialog } from "@/common/components/DeleteConfirmationDialog";
import { ProductSelectionEditModal } from "../ProductSelectionModal/ProductSelectionEditModal";

export const PublishButtonWithDropdown = () => {
	const navigate = useNavigate();
	const { query } = useEditor();
	const [deferredProductModal, setDeferredProductModal] = useState(false);

	const { updateOption, deleteOption } = useBuilderApi();
	const { id } = useParams();
	const { singleOption, updatingOption } = useSelect((select: any) =>
		select(stores?.addons).getAddonBuilderState()
	);

	const handleOptionByStatus = async (status: string) => {
		const json = query.serialize();
		const craftData = JSON.parse(json);
		const fields = craftJsToBackend(craftData);
		// Read directly from the store so we always get the latest singleOption,
		// even when called from a stale closure (e.g. onAfterSave after the modal updates product_type).
		const { singleOption: freshOption } = select(stores?.addons).getAddonBuilderState();
		const payload = {
			...freshOption,
			status: status,
			fields: fields,
			craftData: craftData,
		};
		await updateOption(Number(id), payload);
	};

	const handlePublish = () => {
		// Show product selection modal only if no product type has been assigned yet
		if (!singleOption?.product_type) {
			setDeferredProductModal(true);
			return;
		}
		handleOptionByStatus("publish");
	};

	return (
		<>
			<ButtonGroup>
				<Button
					variant="default"
					onClick={handlePublish}
					disabled={updatingOption === Number(id)}
					loading={updatingOption === Number(id)}
					className="opt-builder-save-btn"
				>
					{singleOption?.status === "publish"
						? __("Save changes", "optiontics")
						: __("Publish", "optiontics")}
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="default"
							className="opt-builder-save-dropdown-btn pl-2 border-l! border-l-[#103D99]!"
						>
							<ChevronDownIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<If condition={singleOption?.status === "publish"}>
							<DropdownMenuItem onClick={() => handleOptionByStatus("draft")} className="opt-switch-to-draft-btn">
								{__("Switch to Draft", "optiontics")}
							</DropdownMenuItem>
						</If>
						<DeleteConfirmationDialog
							onConfirm={async () => {
								await deleteOption(Number(id));
								navigate(ADDON_LIST_PATH);
							}}
							title={__("Delete Option", "optiontics")}
							description={__(
								"Are you sure you want to delete this option?",
								"optiontics"
							)}
							trigger={
								<DropdownMenuItem
									className="px-2.5 flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 opt-delete-option-btn"
									onSelect={(e) => e.preventDefault()}
								>
									{__("Delete Option", "optiontics")}
								</DropdownMenuItem>
							}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
			</ButtonGroup>

			{/* Deferred product selection — only shown when Publish is clicked with no product assigned */}
			<ProductSelectionEditModal
				isOpen={deferredProductModal}
				onClose={() => setDeferredProductModal(false)}
				onAfterSave={() => {
					setDeferredProductModal(false);
					handleOptionByStatus("publish");
				}}
			/>
		</>
	);
};
