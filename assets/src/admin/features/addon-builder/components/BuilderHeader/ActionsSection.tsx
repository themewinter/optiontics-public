/**
 * WordPress dependencies
 */
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { useEditor } from "@craftjs/core";
import { Save } from "lucide-react";
import { useParams } from "react-router-dom";

/**
 * Internal dependencies
 */
import { stores } from "@/globalConstant";
import { Button } from "@/shadcn/components/ui";
import { craftJsToBackend } from "../../utils";
import { PublishButtonWithDropdown } from "./PublishButtonWithDropdown";
import useBuilderApi from "../../hooks/useBuilderApi";
import { If } from "@/common/components";

export const ActionsSection = () => {
    const { query } = useEditor();
    const { id } = useParams();
    const { updateOption } = useBuilderApi();
    const { singleOption, updatingOption } = useSelect(
        (select: any) => select(stores?.addons).getAddonBuilderState(),
        [],
    );

    const handleSaveDraft = async () => {
        const json = query.serialize();
        const craftData = JSON.parse(json);

        // Convert Craft.js format to backend format
        const fields = craftJsToBackend(craftData);

        const payload = {
            ...singleOption,
            status: "draft",
            fields: fields,
            craftData: craftData,
        };
        await updateOption(Number(id), payload);
    };

    return (
        <div className="flex items-center gap-2">
            <If condition={singleOption?.status === "draft"}>
                <Button variant="softPrimary" onClick={handleSaveDraft} disabled={updatingOption === Number(id)} loading={updatingOption === Number(id)} className="opt-save-draft-btn">
                    <Save size={16} />
                    {updatingOption === Number(id) ? __("Saving...", "optiontics") : __("Save Draft", "optiontics")}
                </Button>
            </If>

            <PublishButtonWithDropdown />
        </div>
    );
};
