/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";

/**
 * External dependencies
 */
import { Info } from "lucide-react";
import { useParams } from "react-router-dom";

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
import { useProductSelectionForm } from "./hooks";
import { ProductConditionalFields } from "./ProductConditionalFields";
import useBuilderApi from "../../hooks/useBuilderApi";
import { stores } from "@/globalConstant";
import { useEditor } from "@craftjs/core";

export function ProductSelectionEditModal({
    isOpen,
    onClose,
    onAfterSave,
}: {
    isOpen: boolean;
    onClose: () => void;
    onAfterSave?: () => void;
}) {

    const { query } = useEditor();
    const json = query.serialize();
    const craftData = JSON.parse(json);

    const { id } = useParams();
    const { updateOption } = useBuilderApi();
    const { products, categories, updatingOption } = useSelect(
        (select: any) => select(stores?.addons).getAddonBuilderState(),
    );

    const { form, singleOption } = useProductSelectionForm(true); // isEditMode is true
    const selectedProductType = form.watch("product_type");
    const onSubmit = async (values: any) => {
        const payload = { ...singleOption, ...values, craftData: craftData };
        await updateOption(Number(id), payload);
        form.reset(values);
        onAfterSave ? onAfterSave() : onClose();
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
                onClose();
            }}
        >
            <DialogContent className="w-[95vw] sm:max-w-[620px]">
                <DialogHeader>
                    <DialogTitle className="text-left text-lg font-semibold">
                        {__("Edit Product Selection", "optiontics")}
                    </DialogTitle>
                </DialogHeader>

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
                            tooltip="Edit the type of product this addon applies to"
                            options={ADDON_LIST_OPTIONS}
                        />

                        {renderConditionalField()}

                        <div className="flex items-start gap-2 p-3 rounded-md border border-neutral-200 bg-neutral-50">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                            <p className="text-sm my-0! text-neutral-600">
                                {__(
                                    "Update the product type and related configuration for this addon option.",
                                    "optiontics",
                                )}
                            </p>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={onClose}
                                disabled={updatingOption === Number(id)}
                            >
                                {__("Cancel", "optiontics")}
                            </Button>
                            <Button
                                type="submit"
                                disabled={updatingOption === Number(id)}
                                loading={updatingOption === Number(id)}
                            >
                                {updatingOption === Number(id)
                                    ? __("Updating...", "optiontics")
                                    : __("Update", "optiontics")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
