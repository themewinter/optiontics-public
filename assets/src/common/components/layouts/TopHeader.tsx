/**
 * Wordpress Dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { ChevronLeft } from "lucide-react";

/**
 * Internal dependencies
 */
import { TopHeaderProps } from "@/types/components";
import { Button } from "@/shadcn/components/ui";
import { If } from "..";
import { OptionticsLogoWithText } from "@/common/icons";

export const TopHeader = ({ title, rightContent, goBack }: TopHeaderProps) => {
    return (
        <div className="sticky top-0 sm:top-[40px] md:top-[30px] z-50 bg-white wcf-custom-shadow">
            <div className="flex w-full gap-4 items-center justify-between px-6 py-5 flex-wrap">
                <div className="flex gap-2">
                    <If condition={!!goBack}>
                        <Button onClick={goBack} size="icon">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </Button>
                    </If>
                    <If condition={!title}>
                        <OptionticsLogoWithText />
                    </If>
                    <If condition={title}>
                        <div className="text-xl md:text-[22px] font-semibold text-black">
                            {title}
                        </div>
                    </If>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap md:flex-nowrap">
                    {rightContent}
                </div>
            </div>
        </div>
    );
};
