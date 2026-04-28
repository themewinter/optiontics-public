import { useEffect } from "@wordpress/element";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelect } from "@wordpress/data";
import { stores } from "@/globalConstant";
import { formSchema } from "@/admin/features/addon-list/validation";

type FormValues = z.infer<typeof formSchema>;

export const useProductSelectionForm = (isEditMode = false) => {
    const { singleOption } = useSelect((select) =>
        select(stores?.addons).getAddonBuilderState(),
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    // Prefill for edit mode
    useEffect(() => {
        if (isEditMode && singleOption?.product_type) {
            form.setValue("product_type", singleOption?.product_type);
            form.setValue("exclude_products", singleOption?.exclude_products);
            form.setValue("include_products", singleOption?.include_products);
            form.setValue("include_categories", singleOption?.include_categories);
        }
    }, [isEditMode, singleOption?.product_type]);

    return { form, singleOption };
};
