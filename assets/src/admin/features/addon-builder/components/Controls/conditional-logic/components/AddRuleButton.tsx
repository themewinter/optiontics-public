/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Button } from "@/shadcn/components/ui/button";
import { Plus } from "lucide-react";

export const AddRuleButton: React.FC<{
    onAdd: () => void;
    disabled: boolean;
}> = ({ onAdd, disabled }) => (
    <Button
        onClick={onAdd}
        variant="default"
        className="w-fit"
        disabled={disabled}
    >
        <Plus className="w-4 h-4 mr-2" />
        {__("Add New", "optiontics")}
    </Button>
);
