/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";

/**
 * External dependencies
 */
import { Eye, Monitor, Smartphone, LayoutTemplate, Plus } from "lucide-react";

/**
 * Internal dependencies
 */
import { DUMMY_PRODUCT_PRICE } from "../constant";
import { Price } from "@/common/components";
import { stores } from "@/globalConstant";
import { TemplateBrowserModal } from "@/admin/features/addon-list/components/TemplateBrowserModal";
import { type RemoteTemplate } from "@/api/templates";
import { useEditor } from "@craftjs/core";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";

const DummyProductImage = () => (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="200" fill="#EDE8E3" rx="8" />
        <path
            d="M65 72 L50 55 L25 67 L34 96 L52 89 L52 158 L148 158 L148 89 L166 96 L175 67 L150 55 L135 72 C128 86 72 86 65 72Z"
            fill="#E8917A"
        />
        <path d="M65 72 Q100 94 135 72" stroke="#CF7A63" strokeWidth="2" fill="none" />
        <path d="M50 55 L34 96 L52 89 L65 72 Z" fill="#D47A65" />
        <path d="M150 55 L166 96 L148 89 L135 72 Z" fill="#D47A65" />
        <line x1="100" y1="90" x2="100" y2="158" stroke="#CF7A63" strokeWidth="0.8" strokeDasharray="4 3" />
    </svg>
);

type Device = "desktop" | "mobile";

const EditorCanvas = ({ children }: { children: React.ReactNode }) => {
    const [device, setDevice] = useState<Device>("desktop");
    const [templateModalOpen, setTemplateModalOpen] = useState(false);
    const { setAddonBuilderState } = useDispatch(stores?.addons);
    const { actions, query } = useEditor();
    const { singleOption } = useSelect(
        (select: any) => select(stores?.addons).getAddonBuilderState(),
        [],
    );

    const isPublished   = singleOption?.status === "publish";
    const hasPreviewUrl = !!singleOption?.preview_url;
    const previewEnabled = isPublished && hasPreviewUrl;

    const previewTooltip = !isPublished
        ? __("Publish this option first to preview it", "optiontics")
        : !hasPreviewUrl
            ? __("No product is assigned to this option yet.", "optiontics")
            : "";

    const handleUseTemplate = (template: RemoteTemplate) => {
        // craftData from the remote API may be a JSON string or already an object
        const craftData = typeof template.craftData === "string"
            ? (() => { try { return JSON.parse(template.craftData); } catch { return null; } })()
            : template.craftData;

        if (!craftData) return;

        // Merge template nodes into the existing canvas additively
        const current = JSON.parse(query.serialize());
        const { ROOT: templateRoot, ...templateNodes } = craftData;

        const merged = {
            ...current,
            ...templateNodes,
            ROOT: {
                ...current.ROOT,
                nodes: [...(current.ROOT?.nodes ?? []), ...(templateRoot?.nodes ?? [])],
            },
        };

        actions.deserialize(JSON.stringify(merged));
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 px-4 py-4 gap-3 flex-wrap">

            {/* Top toolbar — never scrolls */}
            <div className="flex items-center justify-between flex-shrink-0 bg-white p-3 rounded-xl flex-wrap">
                <div className="flex items-center bg-white border border-[#E5E7EB] rounded-[8px] p-1 gap-0.5 flex-wrap">
                    <button
                        type="button"
                        onClick={() => setDevice("desktop")}
                        className={`p-1.5 rounded-[6px] transition-colors ${
                            device === "desktop"
                                ? "bg-[#F3F4F6] text-[#111827]"
                                : "text-[#9CA3AF] hover:text-[#6B7280]"
                        }`}
                        title={__("Desktop view", "optiontics")}
                    >
                        <Monitor className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setDevice("mobile")}
                        className={`p-1.5 rounded-[6px] transition-colors ${
                            device === "mobile"
                                ? "bg-[#F3F4F6] text-[#111827]"
                                : "text-[#9CA3AF] hover:text-[#6B7280]"
                        }`}
                        title={__("Mobile view", "optiontics")}
                    >
                        <Smartphone className="size-4" />
                    </button>
                </div>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-flex">
                            <button
                                type="button"
                                disabled={!previewEnabled}
                                onClick={() => previewEnabled && window.open(singleOption.preview_url, "_blank", "noopener,noreferrer")}
                                className={`flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-[8px] px-3 py-1.5 text-sm font-medium transition-colors ${previewEnabled ? "text-[#374151] hover:bg-[#F9FAFB] cursor-pointer" : "text-[#9CA3AF] cursor-not-allowed pointer-events-none"}`}
                            >
                                <Eye className="size-4 text-[#6B7280]" />
                                {__("Preview", "optiontics")}
                            </button>
                        </span>
                    </TooltipTrigger>
                    {!previewEnabled && previewTooltip && (
                        <TooltipContent side="bottom">
                            {previewTooltip}
                        </TooltipContent>
                    )}
                </Tooltip>
            </div>

            {/* Card — fills remaining height, scrolls internally */}
            <div
                className={`bg-white rounded-[10px] border border-[#E5E7EB] flex flex-col flex-1 min-h-0 overflow-hidden transition-all duration-300 ${
                    device === "mobile" ? "max-w-[390px] mx-auto w-full" : "w-full"
                }`}
            >
                {/* Main body */}
                <div className={`flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden `}>

                    {/* Image column — side on desktop, top on mobile */}
                    <div className={
                        device === "mobile"
                            ? "w-full flex-shrink-0 p-3 flex flex-col gap-2"
                            : "w-full lg:w-[40%] flex-shrink-0 p-4 flex flex-col gap-2 self-start sticky top-0"
                    }>
                        <div className={`bg-[#EDE8E3] rounded-[8px] overflow-hidden w-full aspect-[4/2] lg:aspect-square`}>
                            <DummyProductImage />
                        </div>
                        <div className="flex gap-1.5">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="flex-1 h-[28px] bg-[#E9E9E9] rounded-[4px]"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content column — scrollable on desktop, flows on mobile */}
                    <div className="w-full lg:w-[60%] min-w-0 overflow-y-auto no-scrollbar p-4 lg:py-4 lg:pr-4">
                        <h2 className="text-sm font-bold text-[#111827] mt-0! mb-0.5 leading-snug ">
                            {__("Product Title Here", "optiontics")}
                        </h2>
                        <p className="text-sm font-semibold text-[#111827] mt-0! mb-1">
                            <Price price={DUMMY_PRODUCT_PRICE} className="text-sm font-semibold" />
                        </p>
                        <p className="text-xs text-[#6B7280] leading-relaxed mt-0! mb-1">
                            {__(
                                "This is a preview of how the product options will appear on the product page. Use the 'Add Elements' button to add option blocks and configure their settings.",
                                "optiontics"
                            )}
                        </p>

                        {/* Craft.js canvas output */}
                        {children}
                    </div>
                </div>

                {/* Bottom buttons — full width of the card */}
                <div className={device === "mobile" ? "w-full flex items-center gap-3 px-3 py-3 border-t border-[#F3F4F6] flex-shrink-0" : "w-full lg:w-[60%]  ml-auto flex items-center gap-3 px-4 py-3 border-t border-[#F3F4F6] flex-shrink-0"}>
                    <button
                        type="button"
                        onClick={() => setTemplateModalOpen(true)}
                        className="flex flex-1 items-center justify-center gap-1.5 border border-[#E5E7EB] rounded-[8px] py-2.5 text-sm font-medium text-[#374151] bg-white hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                    >
                        <LayoutTemplate className="size-4 text-[#6B7280]" />
                        {__("Select Template", "optiontics")}
                    </button>
                    <button
                        type="button"
                        onClick={() => setAddonBuilderState({ collapsed: true })}
                        className="flex flex-1 items-center justify-center gap-1.5 bg-[#4B4B4B] text-white rounded-[8px] py-2.5 text-sm font-medium hover:bg-[#1F2937] transition-colors cursor-pointer"
                    >
                        <Plus className="size-4" />
                        {__("Add Elements", "optiontics")}
                    </button>
                </div>
            </div>

            {/* Template browser modal */}
            <TemplateBrowserModal
                isOpen={templateModalOpen}
                onClose={() => setTemplateModalOpen(false)}
                onUseTemplate={handleUseTemplate}
            />
        </div>
    );
};

export default EditorCanvas;
