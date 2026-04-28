/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
/**
 * Internal dependencies
 */
import { SelectField } from "@/common/components/form/SelectField";

interface ProductConditionalFieldsProps {
    control: any;
    selectedProductType?: string;
    products?: {
        value: string;
        label: string;
    }[];
    categories?: {
        value: string;
        label: string;
    }[];
}

export const ProductConditionalFields = ({
    control,
    selectedProductType,
    products,
    categories,
}: ProductConditionalFieldsProps) => {
    if (!selectedProductType) return null;

    switch (selectedProductType) {
        case "all_woo_products":
            return (
                <SelectField
                    label={__("Exclude Specific Products", "optiontics")}
                    control={control}
                    name="exclude_products"
                    options={products}
                    placeholder="Select Products to Exclude"
                    isMulti
                />
            );

        case "specific_woo_products":
            return (
                <SelectField
                    control={control}
                    name="include_products"
                    label={__("Select Specific Product", "optiontics")}
                    placeholder="Select Product"
                    options={products}
                    isMulti
                />
            );

        case "specific_woo_categories":
            return (
                <SelectField
                    control={control}
                    name="include_categories"
                    label={__("Select Category", "optiontics")}
                    placeholder="Select Category"
                    options={categories}
                    isMulti
                />
            );

        default:
            return null;
    }
};
