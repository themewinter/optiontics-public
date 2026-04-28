/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";

/**
 * External dependencies
 */
import { Plus, CirclePlus, Info } from "lucide-react";

/**
 * Internal dependencies
 */
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { Button } from "@/shadcn/components/ui/button";
import { Checkbox } from "@/shadcn/components/ui/checkbox";
import { Textarea } from "@/shadcn/components/ui/textarea";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/shadcn/components/ui/tooltip";
import { ControlGeneratorProps } from "../../../types";
import OptionRow from "./OptionRow";
import { useOptionsMutations } from "./hooks/useOptionsMutations";
import { useOptionsDrag } from "./hooks/useOptionsDrag";
import type { Option } from "./types";
import { useAdminLicenseCheck } from "@/common/hooks/useAdminLicenseCheck";
import { ProBadge } from "@/common/components";

interface Props extends ControlGeneratorProps<any> {
    open: boolean;
    onClose: () => void;
}

export default function OptionsModal({
    attributes,
    setAttribute,
    open,
    onClose,
}: Props) {
    const options = (attributes?.options ?? []) as Option[];
    const blockType = attributes?.type ?? "";
    const isProActivated = useAdminLicenseCheck();
    const [showSalePrice, setShowSalePrice] = useState(false);
    const [bulkOpen, setBulkOpen] = useState(false);
    const [bulkText, setBulkText] = useState("");

    const {
        addOption,
        updateOption,
        updateOptionFields,
        deleteOption,
        toggleDefault,
        uploadImage,
        removeImage,
        setOptions,
    } = useOptionsMutations(options, setAttribute, blockType);

    const {
        draggingIndex,
        overIndex,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    } = useOptionsDrag<Option>(options, setOptions);

    const handleBulkInsert = () => {
        const lines = bulkText
            .split(/[\n,]/)
            .map((l) => l.trim())
            .filter(Boolean);
        if (!lines.length) return;
        const newOptions: Option[] = lines.map((line) => ({
            value: line,
            type: "fixed",
            regular: "",
            sale: "",
            default: false,
            image: "",
        }));
        setAttribute("options", [...options, ...newOptions]);
        setBulkText("");
        setBulkOpen(false);
    };

    // Keep the Manage Items dialog open while the WP media frame is active.
    // WP media mounts outside Radix's portal, so clicks/focus inside it look
    // like "outside" interactions and would otherwise dismiss this dialog.
    const ignoreIfInsideMediaFrame = (e: Event) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest?.(".media-modal, .media-modal-backdrop")) {
            e.preventDefault();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent
                className="w-[95vw] md:max-w-3xl p-0 gap-0 overflow-hidden"
                onInteractOutside={ignoreIfInsideMediaFrame}
                onFocusOutside={ignoreIfInsideMediaFrame}
            >
                <DialogHeader
                    className={`px-6 border-b border-gray-200${
                        (window as any).optiontics?.option_tics_multivendor ===
                        "1"
                            ? " py-4"
                            : ""
                    }`}
                >
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        {__("Manage Items", "optiontics")}
                    </DialogTitle>
                </DialogHeader>

                {/* Table header */}
                <div className="px-6 pt-4">
                    <div className="grid grid-cols-[20px_40px_1fr_120px_180px_40px] gap-2 items-center px-2 pb-2 text-xs font-semibold text-gray-500 tracking-wide">
                        <div />
                        <div>{__("Image", "optiontics")}</div>
                        <div>{__("Option items", "optiontics")}</div>
                        <div>{__("Type", "optiontics")}</div>
                        <div>{__("Regular price", "optiontics")}</div>
                        <div />
                    </div>

                    {/* Option rows */}
                    <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                        {options.map((option, index) => (
                            <OptionRow
                                key={index}
                                option={option}
                                index={index}
                                dragging={draggingIndex === index}
                                over={overIndex === index}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onDragEnd={handleDragEnd}
                                updateOption={updateOption}
                                updateOptionFields={updateOptionFields}
                                toggleDefault={toggleDefault}
                                deleteOption={deleteOption}
                                uploadImage={uploadImage}
                                removeImage={removeImage}
                                blockType={blockType}
                                showSalePrice={showSalePrice}
                                imageEnabled={isProActivated}
                            />
                        ))}
                    </div>

                    {/* Bulk add panel */}
                    {bulkOpen && (
                        <div className="my-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm font-semibold text-gray-900">
                                    {__("Bulk add items", "optiontics")}
                                </span>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="w-4 h-4 text-primary" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {__(
                                            "Enter items separated by commas or new lines. Each item will be added as a new option.",
                                            "optiontics",
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                                <span className="text-xs text-gray-500">
                                    {__(
                                        "Enter items separated by commas or new lines. Each item will be added as a new option.",
                                        "optiontics",
                                    )}
                                </span>
                            </div>
                            <Textarea
                                value={bulkText}
                                onChange={(e) => setBulkText(e.target.value)}
                                placeholder={__(
                                    'e.g "Add engraving text option" or "Make it more minimal"',
                                    "optiontics",
                                )}
                                className="min-h-28 text-sm bg-white border-gray-300 resize-none"
                            />
                            <div className="flex gap-2 mt-3">
                                <Button
                                    size="sm"
                                    variant="softPrimary"
                                    onClick={handleBulkInsert}
                                >
                                    {__("Bulk Insert", "optiontics")}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setBulkOpen(false);
                                        setBulkText("");
                                    }}
                                >
                                    {__("Bulk Close", "optiontics")}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Add / Bulk buttons */}
                    {!bulkOpen && (
                        <div className="flex gap-2 mt-4 mb-4">
                            <Button
                                size="sm"
                                variant="softPrimary"
                                onClick={addOption}
                                className="opt-add-new-option-btn"
                            >
                                <Plus className="w-4 h-4" />
                                {__("Add Option Value", "optiontics")}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setBulkOpen(true)}
                            >
                                <CirclePlus className="w-4 h-4" />
                                {__("Bulk Add", "optiontics")}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-6">
                        {/* Show sales price toggle */}
                        <label
                            className={`flex items-center gap-2 select-none text-sm text-gray-700 ${
                                isProActivated
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed"
                            }`}
                        >
                            <Checkbox
                                checked={isProActivated ? showSalePrice : false}
                                onCheckedChange={(v) =>
                                    setShowSalePrice(Boolean(v))
                                }
                                disabled={!isProActivated}
                            />
                            {__("Show sales price", "optiontics")}
                            {!isProActivated && <ProBadge />}
                        </label>
                    </div>

                    <Button variant="outline" size="sm" onClick={onClose}>
                        {__("Close", "optiontics")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
