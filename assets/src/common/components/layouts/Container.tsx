/**
 * Internal Dependencies
 */
import { cn } from "@/shadcn/lib/utils";

export const Container = ({
    children,
    className,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return <div className={cn("w-full mx-auto", className)}>{children}</div>;
};

// If this module is evaluated more than once, prevent duplicate registrations.
window?.wp?.hooks?.removeFilter?.("optiontics_container", "optiontics");

window?.wp?.hooks?.addFilter?.(
    "optiontics_container",
    "optiontics",
    (_, props) => <Container {...props} />,
    10,
);
