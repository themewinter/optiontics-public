/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { stores } from "@/globalConstant";
import { ADDON_LIST_OPTIONS } from "@/admin/features/addon-list/constant";
import { BuilderHeaderTitleEdit } from "@/common/icons";

export const CategoryEditSection = () => {
    const { singleOption } = useSelect((select) =>
        select(stores?.addons).getAddonBuilderState(),
    );
    const { setAddonBuilderState } = useDispatch(stores?.addons);

    return (
        <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 gap-2 min-w-[200px] md:min-w-[250px] lg:min-w-[300px] xl:min-w-[370px] cursor-pointer">
            <span
                className="flex-1 text-gray-600 cursor-pointer text-sm"
                onClick={() =>
                    setAddonBuilderState({ productSelectionModal: true })
                }
            >
                {
                    ADDON_LIST_OPTIONS.find(
                        (option) => option.value === singleOption?.product_type,
                    )?.label
                }
            </span>
            <button
                onClick={() =>
                    setAddonBuilderState({ productSelectionModal: true })
                }
                className="opt-builder-header-edit-btn text-gray-400 hover:text-gray-600"
            >
                <BuilderHeaderTitleEdit />
            </button>
        </div>
    );
};
