/**
 * Optiontics PageHeader component.
 *
 * Figma (node 2200-516..526):
 *   Title: 22px, weight 510, color #373360, leading-28px
 *   Container: full-width flex row, space-between, align-center
 *   Border-bottom: 1px #CBD8EA, padding-bottom 16px, margin-bottom 24px
 */
import type { ReactNode } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { BookOpenIcon, LifeBuoyIcon } from "lucide-react";

import { cn } from "@/shadcn/lib/utils";
import { MoreIcon } from "@/common/icons/MoreIcon";
import { AngleLeftIcon } from "@/common/icons";
import { Button } from "@/common/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";

export interface PageHeaderProps {
    title: string;
    /** Extra ReactNode rendered in the right slot before the docs menu (buttons, etc.) */
    actions?: ReactNode;
    /** When provided, renders a back button on the left of the title */
    onBack?: () => void;
    className?: string;
}

export function PageHeader({
    title,
    actions,
    onBack,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                "flex w-full items-center justify-between px-8 py-3 mb-6 bg-[var(--opt-white)]",
                "border-b border-[var(--opt-border)]",
                className,
            )}
        >
            <div className="flex items-center gap-3">
                {onBack && (
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <AngleLeftIcon />
                    </Button>
                )}
                <h1
                    className="text-[22px] font-[510] leading-7 tracking-[-0.02em] whitespace-nowrap"
                    style={{ color: "var(--opt-text-secondary)", margin: 0 }}
                >
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-2">
                {actions}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center justify-center rounded-[6px] transition-colors duration-150 cursor-pointer"
                            style={{
                                width: 44,
                                height: 44,
                                backgroundColor: "var(--opt-action-btn-bg)",
                                color: "var(--opt-text-tertiary)",
                            }}
                            onMouseEnter={(e) => {
                                (
                                    e.currentTarget as HTMLButtonElement
                                ).style.color = "var(--opt-text-default)";
                            }}
                            onMouseLeave={(e) => {
                                (
                                    e.currentTarget as HTMLButtonElement
                                ).style.color = "var(--opt-text-tertiary)";
                            }}
                        >
                            <MoreIcon size={20} color="currentColor" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() =>
                                window.open(
                                    "https://arraytics.com/optiontics/docs/",
                                    "_blank",
                                )
                            }
                        >
                            <BookOpenIcon size={15} />
                            {__("Help docs", "optiontics")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() =>
                                window.open(
                                    "https://arraytics.com/support/",
                                    "_blank",
                                )
                            }
                        >
                            <LifeBuoyIcon size={15} />
                            {__("Support Ticket", "optiontics")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

// If this module is evaluated more than once, prevent duplicate registrations.
window?.wp?.hooks?.removeFilter?.("optiontics_page_header", "optiontics");

window?.wp?.hooks?.addFilter?.(
    "optiontics_page_header",
    "optiontics",
    (_, props) => <PageHeader {...props} />,
    10,
);
