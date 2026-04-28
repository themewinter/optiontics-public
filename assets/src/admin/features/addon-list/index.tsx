/**
 * Wordpress dependencies
 */
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { AddonListsTable } from "./components/AddonListsTable";
import { AddOptionsButton, Container } from "@/common/components";
import { PageHeader } from "@/common/components/layouts/PageHeader";
import { stores } from "@/globalConstant";
import useBuilderApi from "../addon-builder/hooks/useBuilderApi";
import WooCommerceAlert from "./components/WooCommerceAlert";
import { useWooCommerceStatus } from "./hooks/useWooCommerceStatus";

const AddonList = () => {
	const { getAddonLists } = useBuilderApi();
	const isWooCommerceActive = useWooCommerceStatus();

	const { addonList, needsRevalidation } = useSelect(
		(select: any) => select(stores?.addons).getAddonBuilderState(),
		[]
	);

	// Show WordPress admin header and sidebar on listing page
	useEffect(() => {
		document.documentElement.classList.remove("optiontics-builder-active");
	}, []);

	useEffect(() => {
		if (!addonList?.length || needsRevalidation) {
			getAddonLists();
		}
	}, []);

	return (
		<div className="space-y-4">
			<Container className="space-y-4 opt-options-list-container">
				<PageHeader
					title={__("Option list", "optiontics")}
					actions={<AddOptionsButton />}
				/>
				<WooCommerceAlert isWooCommerceActive={isWooCommerceActive} />
				<AddonListsTable />
			</Container>
		</div>
	);
};

export default AddonList;
