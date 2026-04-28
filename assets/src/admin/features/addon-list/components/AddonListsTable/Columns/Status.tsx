/**
 * WordPress dependencies
 */
import { useSelect } from "@wordpress/data";

/**
 * Internal dependencies
 */
import { SwitchButton } from "@/common/components/ui/SwitchButton";
import { stores } from "@/globalConstant";
import useBuilderApi from "../../../../addon-builder/hooks/useBuilderApi";

export const Status = ({ record }: { record: any }) => {
	const { id, status } = record;
	const { updateOption } = useBuilderApi();
	const { updatingOption } = useSelect(
		(select: any) => select(stores?.addons).getAddonBuilderState(),
		[],
	);

	const handleStatusChange = (checked: boolean) => {
		const newStatus = checked ? "publish" : "draft";
		updateOption(Number(id), { ...record, status: newStatus });
	};

	return (
		<SwitchButton
			checked={status === "publish"}
			onChange={handleStatusChange}
			disabled={updatingOption === Number(id)}
		/>
	);
};
