/**
 * WordPress dependencies
 */
import { FC } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { Skeleton } from "@/shadcn/components/ui";

const PluginCardSkeleton: FC = () => {
    return (
        <div className="bg-white border border-neutral-300 rounded-lg p-4">
            <div className="space-y-3">
                <Skeleton className="h-12 w-22" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-end items-center pt-2">
                    <Skeleton className="h-9 w-20" />
                </div>
            </div>
        </div>
    );
};

export default PluginCardSkeleton;
