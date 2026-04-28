/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { Editor } from "@craftjs/core";
import { ProductSelectionEditModal } from "../ProductSelectionModal/ProductSelectionEditModal";
import { stores } from "@/globalConstant";
import { BuilderLayout } from "./BuilderLayout";
import { BlockListsModal } from "../BlockListsModal";
import useBuilderApi from "../../hooks/useBuilderApi";
import { useWooCommerceStatus } from "@/admin/features/addon-list/hooks/useWooCommerceStatus";

export const EditorWrapper = ({ resolver }: { resolver: any }) => {
    const { productSelectionModal, products, categories } = useSelect(
        (select: any) => select(stores?.addons).getAddonBuilderState(),
        [],
    );
    const { setAddonBuilderState } = useDispatch(stores?.addons);
    const { getProducts, getCategories } = useBuilderApi();
    const isWooCommerceActive = useWooCommerceStatus();

    // Fetch products and categories once here — centralized so that the two
    // ProductSelectionEditModal instances (here and in PublishButtonWithDropdown)
    // don't each trigger their own duplicate fetches.
    useEffect(() => {
        if (Array.isArray(products) && products.length === 0 && isWooCommerceActive) {
            getProducts();
        }
        if (Array.isArray(categories) && categories.length === 0 && isWooCommerceActive) {
            getCategories();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Editor
            resolver={resolver}
        >
            <ProductSelectionEditModal
                isOpen={productSelectionModal}
                onClose={() =>
                    setAddonBuilderState({ productSelectionModal: false })
                }
            />
            <BuilderLayout />
            <BlockListsModal />
        </Editor>
    );
};
