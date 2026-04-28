/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { useRef } from "@wordpress/element";

/**
 * External dependencies
 */
import { useParams } from "react-router-dom";

/**
 * Internal dependencies
 */
import { stores } from "@/globalConstant";
import { If } from "@/common/components/If";
import useBuilderApi from "../../hooks/useBuilderApi";
import { useEditor } from "@craftjs/core";
import { BuilderHeaderTitleEdit } from "@/common/icons";

export const TitleEditSection = () => {
	const { id } = useParams();
	const state = useSelect((select) =>
		select(stores?.addons).getAddonBuilderState()
	);
	const { updateOption } = useBuilderApi();
	const { setAddonBuilderState } = useDispatch(stores?.addons);
	const { query } = useEditor();
	const { title, isEditingTitle, singleOption } = state || {};
	const titleOnEditStart = useRef<string>("");

	const handleStartEditing = () => {
		titleOnEditStart.current = title ?? "";
		setAddonBuilderState({ isEditingTitle: true });
	};

	const handleStopEditing = () => {
		setAddonBuilderState({ isEditingTitle: false });

		if (title === titleOnEditStart.current) return;

		const json = query.serialize();
		const craftData = JSON.parse(json);

		const payload = {
			...singleOption,
			title: title,
			craftData: craftData,
		};
		updateOption(Number(id), payload);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleStopEditing();
		}
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddonBuilderState({ title: e.target.value });
	};

	return (
		<>
			<If condition={isEditingTitle}>
				<input
					type="text"
					value={title}
					onChange={handleTitleChange}
					onBlur={handleStopEditing}
					onKeyDown={handleKeyDown}
					className="flex-1 bg-transparent outline-none text-gray-800 text-base font-semibold placeholder:text-gray-500 focus:ring-1 focus:ring-gray-300"
					autoFocus
				/>
			</If>
			<If condition={!isEditingTitle}>
				<span
					className="flex-1 text-gray-800 text-base font-semibold cursor-pointer truncate max-w-[120px] md:max-w-[200px]"
					onClick={handleStartEditing}
				>
					{title || __("Untitled Option", "optiontics")}
				</span>
				<button
					onClick={handleStartEditing}
					className="opt-builder-header-edit-btn text-gray-400 hover:text-gray-600 cursor-pointer"
				>
					<BuilderHeaderTitleEdit />
				</button>
			</If>
		</>
	);
};
