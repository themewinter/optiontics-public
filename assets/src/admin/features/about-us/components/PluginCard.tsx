/**
 * WordPress dependencies
 */
import { FC } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { FileText, CirclePlay } from "lucide-react";

/**
 * Internal dependencies
 */
import { Button } from "@/shadcn/components/ui/button";
import { Card } from "@/shadcn/components/ui";

const statusToBtnText: Record<string, string> = {
    deactivate: __("Deactivate", "optiontics"),
    activate: __("Activate", "optiontics"),
    install: __("Install", "optiontics"),
};

export interface PluginCardProps {
    name: string;
    title: string;
    description: string;
    status: string;
    is_pro?: boolean;
    doc_link?: string;
    demo_link?: string;
    settings_link?: string;
    icon?: string;
    loading?: boolean;
    onAction?: (name: string, status: string) => void;
}

const PluginCard: FC<PluginCardProps> = ({
    name,
    title,
    description,
    status,
    doc_link,
    demo_link,
    icon,
    loading,
    onAction,
}) => {
    const handleAction = () => {
        if (onAction) {
            onAction(name, status);
        }
    };

    const handleReadMoreClick = () => {
        if (doc_link) {
            window.open(doc_link, "_blank");
        }
    };

    const handleTutorialClick = () => {
        if (demo_link) {
            window.open(demo_link, "_blank");
        }
    };

    const btnText =
        statusToBtnText[status] || __("Install Now", "optiontics");

    return (
        <Card className="relative bg-white rounded-lg border border-neutral-300 shadow-none p-0">
            {/* Content Area */}
            <div className="space-y-3 p-5">
                {/* Header with icon */}
                <div className="flex items-center justify-between">
                    <div
                        className={`flex items-center justify-center  bg-card rounded-lg`}
                    >
                        {icon ? (
                            icon.trim().startsWith("<") ? (
                                <div
                                    className={`flex items-center justify-center`}
                                    dangerouslySetInnerHTML={{ __html: icon }}
                                />
                            ) : (
                                <img
                                    src={icon}
                                    alt={title}
                                    className={`object-contain`}
                                />
                            )
                        ) : (
                            <FileText className="w-6 h-6 text-black/60" />
                        )}
                    </div>
                </div>

                {/* Title */}
                <div>
                    <h4 className="font-semibold text-black text-base! leading-tight my-0!">
                        {title}
                    </h4>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed my-0! text-black/60">
                    {description}
                </p>

                {/* Links Row */}
                <div className="flex items-center gap-4 mt-2">
                    {doc_link && (
                        <Button
                            variant="link"
                            onClick={handleReadMoreClick}
                            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary transition-colors pl-0!"
                        >
                            <FileText size={14} />
                            {__("Read More", "optiontics")}
                        </Button>
                    )}
                    {demo_link && (
                        <Button
                            variant="link"
                            onClick={handleTutorialClick}
                            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary transition-colors pl-0!"
                        >
                            <CirclePlay size={14} />
                            {__("Tutorial", "optiontics")}
                        </Button>
                    )}
                </div>
            </div>

            {/* Footer with action button */}
            <div className="mt-auto p-4 border-t border-border">
                <div className="flex items-center justify-end gap-2">
                    <Button
                        onClick={handleAction}
                        disabled={loading}
                        className="text-sm h-9 px-4"
                        loading={loading}
                        variant={status === "deactivate" ? "outline" : "default"}
                    >
                        {btnText}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default PluginCard;
