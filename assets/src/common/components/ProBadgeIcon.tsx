/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal Dependencies
 */
import { cn } from "@/shadcn/lib/utils";
import { ProIcon } from "../icons";
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

export const ProBadgeIcon = ({ className }: ProBadgeProps) => (
    <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
            <button
                type="button"
                className={cn(
                    "inline-flex items-center cursor-pointer pointer-events-auto bg-transparent border-0 p-0 opacity-80 hover:opacity-100 transition-opacity",
                    className,
                )}
                onClick={handleClick}
            >
                <ProIcon/>
            </button>
        </TooltipTrigger>
        <TooltipContent side="top">
            {__("Upgrade to pro", "optiontics")}
        </TooltipContent>
    </Tooltip>
);