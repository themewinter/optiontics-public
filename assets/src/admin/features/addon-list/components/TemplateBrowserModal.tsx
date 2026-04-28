/**
 * WordPress dependencies
 */
import { useDispatch } from "@wordpress/data";
import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { useNavigate } from "react-router-dom";
import { Eye, Search } from "lucide-react";

/**
 * Internal dependencies
 */
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shadcn/components/ui/dialog";
import { Button } from "@/shadcn/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/shadcn/components/ui/input-group";
import { If } from "@/common/components/If";
import { type RemoteTemplate } from "@/api/templates";
import Api from "@/api";
import { stores } from "@/globalConstant";

import { useTemplatesApi, useTemplatesState } from "@/admin/features/templates/store/useTemplates";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    /** When provided, called instead of navigating to a new option (builder context). */
    onUseTemplate?: (template: RemoteTemplate) => void;
}

/**
 * Resolve craftData to a plain object regardless of whether the API
 * returned a JSON string or an already-decoded object.
 */
function parseCraftData(craftData: RemoteTemplate["craftData"]): Record<string, any> | null {
    if (!craftData) return null;
    if (typeof craftData === "string") {
        try {
            return JSON.parse(craftData);
        } catch {
            return null;
        }
    }
    return craftData as Record<string, any>;
}

/**
 * Preview modal — shows template details before importing.
 */
function TemplatePreviewModal({
    template,
    onClose,
    onUse,
    isCreating,
}: {
    template: RemoteTemplate;
    onClose: () => void;
    onUse: () => void;
    isCreating: boolean;
}) {
    return (
        <Dialog open onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md w-full p-0 gap-0 overflow-hidden" closeButton={false}>
                <DialogHeader className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
                    <DialogTitle className="text-base font-semibold text-gray-900" style={{ margin: 0 }}>
                        {template.title}
                    </DialogTitle>
                    <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </DialogHeader>
                <div className="p-6 flex flex-col gap-4">
                    {template.thumbnail && (
                        <img
                            src={template.thumbnail}
                            alt={template.title}
                            className="w-full rounded-lg object-cover max-h-48"
                        />
                    )}
                    {template.description && (
                        <p className="text-sm text-gray-500">{template.description}</p>
                    )}
                    <div className="flex flex-col gap-0">
                        {(template.fields ?? []).map((field: any, i: number) => (
                            <div
                                key={i}
                                className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                            >
                                <span className="font-medium text-gray-800">{field.label ?? field.blockid}</span>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded capitalize">
                                    {(field.type ?? "").replace(/-/g, " ")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter className="px-6 pb-5">
                    <Button variant="outline" size="sm" onClick={onClose}>
                        {__("Close", "optiontics")}
                    </Button>
                    <Button size="sm" onClick={onUse} loading={isCreating} disabled={isCreating}>
                        {__("Use template", "optiontics")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Empty state when no templates match the search query.
 */
const EmptyState = () => (
    <div className="col-span-5 flex flex-col items-center justify-center py-16 text-gray-400">
        <Search className="w-8 h-8 mb-2 opacity-40" />
        <p className="text-sm mb-0">{__("No templates found.", "optiontics")}</p>
    </div>
);

/**
 * Loading skeleton for the template grid.
 */
const LoadingState = () => (
    <>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col rounded-xl border border-gray-200 overflow-hidden bg-white animate-pulse">
                <div className="w-full aspect-square bg-gray-100" />
                <div className="flex flex-col gap-2 p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-7 bg-gray-100 rounded" />
                </div>
            </div>
        ))}
    </>
);

/**
 * Error state when the API request fails.
 */
const ErrorState = () => (
    <div className="col-span-5 flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-sm mb-0">{__("Failed to load templates. Please try again.", "optiontics")}</p>
    </div>
);

export function TemplateBrowserModal({ isOpen, onClose, onUseTemplate }: Props) {
    const navigate = useNavigate();
    const { setAddonBuilderState } = useDispatch(stores?.addons);
    const { fetchTemplates } = useTemplatesApi();
    const { templates, loading, error } = useTemplatesState();

    const [search, setSearch] = useState("");
    const [preview, setPreview] = useState<RemoteTemplate | null>(null);
    const [creatingId, setCreatingId] = useState<number | null>(null);

    useEffect(() => {
        if (!isOpen || templates?.length) return;
        fetchTemplates();
    }, [isOpen]);

    const filtered = (templates ?? []).filter((t: RemoteTemplate) =>
        t.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleUseTemplate = async (template: RemoteTemplate) => {
        // Builder context: delegate to the caller instead of creating a new option.
        if (onUseTemplate) {
            setPreview(null);
            onClose();
            onUseTemplate(template);
            return;
        }

        setCreatingId(template.id);
        try {
            const craftData = parseCraftData(template.craftData);
            const response = await Api.addons.createOption({
                title: template.title,
                status: "draft",
                fields: template.fields ?? [],
                craftData,
            });
            if (response?.success) {
                setAddonBuilderState({ needsRevalidation: true });
                setPreview(null);
                onClose();
                navigate(`/update/${response?.data?.id}`);
            }
        } catch (e) {
            console.error(e);
        }
        setCreatingId(null);
    };

    const handleClose = () => {
        setSearch("");
        setPreview(null);
        onClose();
    };

    return (
        <>
            <Dialog open={isOpen && !preview} onOpenChange={(v) => !v && handleClose()}>
                <DialogContent className="max-w-5xl w-full p-0 gap-0 overflow-hidden" closeButton={false}>
                    {/* Header */}
                    <DialogHeader className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
                        <DialogTitle className="text-lg font-semibold text-gray-900" style={{ margin: 0 }}>
                            {__("Option Templates", "optiontics")}
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="ml-auto"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                    </DialogHeader>

                    {/* Search */}
                    <div className="px-6 pt-4 pb-2">
                        <InputGroup className="rounded!">
                            <InputGroupInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={__("Search templates...", "optiontics")}
                            />
                            <InputGroupAddon>
                                <Search className="h-4 w-4 text-gray-400" />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    {/* Grid */}
                    <div className="px-6 pb-6 overflow-y-auto max-h-[65vh]">
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {loading && <LoadingState />}

                            {!loading && error && <ErrorState />}

                            {!loading && !error && (
                                <If condition={filtered.length === 0} fallback={
                                    <>
                                        {filtered.map((template: RemoteTemplate) => (
                                            <div
                                                key={template.id}
                                                className="flex flex-col rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition-shadow"
                                            >
                                                {/* Thumbnail */}
                                                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                                                    {template.thumbnail ? (
                                                        <img
                                                            src={template.thumbnail}
                                                            alt={template.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-400 text-center px-2 line-clamp-3">
                                                            {template.title}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Name + buttons */}
                                                <div className="flex flex-col gap-2 p-3">
                                                    <span className="text-sm font-medium text-gray-900 truncate">
                                                        {template.title}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 text-xs h-9 px-2"
                                                            onClick={() => handleUseTemplate(template)}
                                                            loading={creatingId === template.id}
                                                            disabled={!!creatingId}
                                                        >
                                                            {__("Use template", "optiontics")}
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-7 w-7 shrink-0"
                                                            onClick={() => setPreview(template)}
                                                            disabled={!!creatingId}
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                }>
                                    <EmptyState />
                                </If>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Preview modal */}
            <If condition={!!preview}>
                <TemplatePreviewModal
                    template={preview!}
                    onClose={() => setPreview(null)}
                    onUse={() => handleUseTemplate(preview!)}
                    isCreating={creatingId === preview?.id}
                />
            </If>
        </>
    );
}
