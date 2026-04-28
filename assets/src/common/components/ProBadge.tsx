/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal Dependencies
 */
import { cn } from "@/shadcn/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";

type ProBadgeProps = {
    className?: string;
};

const handleClick = () => {
    window.open("https://themewinter.com/optiontics/#optiontics-pricing", "_blank");
};

export const ProBadge = ({ className }: ProBadgeProps) => (
    <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
            <button
                type="button"
                className={cn(
                    "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium  tracking-wide text-amber-800 bg-amber-100 border border-amber-300 cursor-pointer pointer-events-auto opacity-80 hover:opacity-100 transition-opacity",
                    className,
                )}
                onClick={handleClick}
            >
                {__("Pro", "optiontics")}
            </button>
        </TooltipTrigger>
        <TooltipContent side="top">
            {__("Upgrade to pro", "optiontics")}
        </TooltipContent>
    </Tooltip>
);