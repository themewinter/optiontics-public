import { cn } from "@/shadcn/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="skeleton"
            className={cn("bg-gray-200 animate-pulse rounded-md", className)}
            {...props}
        />
    );
}

function FullscreenSkeleton() {
    return (
        <div className="p-10 flex flex-col justify-center gap-4">
            <Skeleton className="h-[20px] w-1/3 rounded-full" />
            <Skeleton className="h-[20px] w-2/3 rounded-full" />
            <Skeleton className="h-[20px] w-3/4 rounded-full" />
            <Skeleton className="h-[20px] w-11/12 rounded-full" />
        </div>
    );
}

export { Skeleton, FullscreenSkeleton };

// If this module is evaluated more than once, prevent duplicate registrations.
window?.wp?.hooks?.removeFilter?.("optiontics_skeleton", "optiontics");

window?.wp?.hooks?.addFilter?.(
    "optiontics_skeleton",
    "optiontics",
    (_, props) => <Skeleton {...props} />,
    10,
);
