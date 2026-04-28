/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect, useState } from "@wordpress/element";

/**
 * External dependencies
 */
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Internal dependencies
 */
import { Form } from "@/shadcn/components/ui";
import { Button } from "@/shadcn/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { SelectField } from "@/common/components/form/SelectField";
import { ADDON_LIST_OPTIONS } from "../../../addon-list/constant";
import Api from "@/api";
import { useProductSelectionForm } from "./hooks";
import { ProductConditionalFields } from "./ProductConditionalFields";
import useBuilderApi from "../../hooks/useBuilderApi";
import { stores } from "@/globalConstant";
import { If } from "@/common/components/If";
import ProductsNotFound from "./components/ProductsNotFound";
import { useWooCommerceStatus } from "@/admin/features/addon-list/hooks/useWooCommerceStatus";

export function ProductSelectionModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { getProducts, getCategories } = useBuilderApi();
    const [isLoading, setIsLoading] = useState(false);
    const { setAddonBuilderState } = useDispatch(stores?.addons);
    const { products, categories, craftData, addonList } = useSelect((select: any) =>
        select(stores?.addons).getAddonBuilderState(),
    );
    const isWooCommerceActive = useWooCommerceStatus();
    const navigate = useNavigate();
    const { form } = useProductSelectionForm(false);
    const selectedProductType = form.watch("product_type");

    useEffect(() => {
        if (Array.isArray(products) && products.length === 0 && isWooCommerceActive) {
            getProducts();
        }
        if (Array.isArray(categories) && categories.length === 0 && isWooCommerceActive) {
            getCategories();
        }
    }, []);

    useEffect(() => {
        form.resetField("exclude_products");
        form.resetField("include_products");
        form.resetField("include_categories");
    }, [selectedProductType]);

    const onSubmit = async (values: any) => {
        setIsLoading(true);
        const payload = {
            title: "Untitled Option",
            status: "draft",
            ...values,
            craftData: craftData,
        };
        const response = await Api.addons.createOption(payload);
        if (response?.success) {
            setAddonBuilderState({ addonList: [response.data, ...(addonList || [])] });
            form.reset();
            navigate(`/update/${response?.data?.id}`);
            onClose();
        }
        setIsLoading(false);
    };

    const renderConditionalField = () => {
        return (
            <ProductConditionalFields
                control={form.control}
                selectedProductType={selectedProductType}
                products={products?.map((product: any) => ({
                    value: product?.id,
                    label: product?.name,
                }))}
                categories={categories?.map((category: any) => ({
                    value: category?.id,
                    label: category?.name,
                }))}
            />
        );
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                form.resetField("product_type");
                onClose();
            }}
        >
            <DialogContent className="sm:max-w-[620px] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-left text-lg font-semibold mt-0!">
                        {__("Product Selection", "optiontics")}
                    </DialogTitle>
                </DialogHeader>
                <If
                    condition={
                        products?.length === 0 || categories?.length === 0
                    }
                >
                    <ProductsNotFound />
                </If>
                <If condition={products?.length > 0 && categories?.length > 0}>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
                            <SelectField
                                control={form.control}
                                name="product_type"
                                label={__("Product Type", "optiontics")}
                                placeholder="Select Product Type"
                                required
                                tooltip="Choose the type of product you want to apply the addon to"
                                options={ADDON_LIST_OPTIONS}
                            />

                            {renderConditionalField()}

                            <div className="flex items-start gap-2 p-3 rounded-md border border-neutral-200 bg-neutral-50">
                                <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                                <p className="text-sm my-0! text-neutral-600">
                                    {__(
                                        "Select the product type you want to apply the addon to",
                                        "optiontics",
                                    )}
                                </p>
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    {__("Cancel", "optiontics")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    loading={isLoading}
                                >
                                    {__("Create", "optiontics")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </If>
            </DialogContent>
        </Dialog>
    );
}
