/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal Dependencies
 */
import { ProBadgeIcon } from "@/common/icons";
import { Button } from "@/shadcn/components/ui/button";
import { cn } from "@/shadcn/lib/utils";

type ProBtnProps = {
    className?: string;
};

export const ProBtn = ({ className }: ProBtnProps) => {
    const handleClick = () =>
        window.open("https://themewinter.com/wp-cafe/pricing/", "_blank");

    return (
        <Button
            onClick={handleClick}
            className={cn("border-amber-500 bg-amber-50", className)}
            variant="outlineDark"
            size="sm"
        >
            <span className="inline-flex items-center gap-2">
                <ProBadgeIcon height={16} width={16} />
                <span>{__("Upgrade to pro", "optiontics")}</span>
            </span>
        </Button>
    );
};
