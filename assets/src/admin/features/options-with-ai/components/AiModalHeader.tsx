/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { DialogHeader, DialogTitle } from "@/shadcn/components/ui/dialog";
import { AiOutlineIcon } from "@/common/icons";

export function AiModalHeader() {
    return (
        <DialogHeader className="flex-row items-center gap-2 px-6 py-4 bg-gray-50 border-b border-gray-200">
            <AiOutlineIcon />
            <DialogTitle
                className="text-base font-semibold text-gray-900 flex-1 leading-none"
                style={{ margin: 0 }}
            >
                {__("Build with AI", "optiontics")}
            </DialogTitle>
        </DialogHeader>
    );
}
