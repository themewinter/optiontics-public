/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";

/**
 * Internal dependencies
 */
import { Button } from "@/common/components/ui/Button";
import { CreationModeModal } from "@/admin/features/addon-list/components/CreationModeModal";
import { useWooCommerceStatus } from "@/admin/features/addon-list/hooks/useWooCommerceStatus";
import { stores } from "@/globalConstant";

export const AddOptionsButton = () => {
    const isWooCommerceActive = useWooCommerceStatus();
    const { setAddonBuilderState } = useDispatch(stores?.addons);
    const { creationModeModal } = useSelect(
        (select: any) => select(stores?.addons).getAddonBuilderState(),
        []
    );

    return (
        <>
            <Button
                className="opt-addon-list-add-btn"
                onClick={() => setAddonBuilderState({ creationModeModal: true })}
                disabled={!isWooCommerceActive}
            >
                {__("Add Options", "optiontics")}
            </Button>
            <CreationModeModal
                isOpen={!!creationModeModal}
                onClose={() => setAddonBuilderState({ creationModeModal: false })}
            />
        </>
    );
};
