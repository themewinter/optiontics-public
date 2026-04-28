import * as React from "@wordpress/element";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/shadcn/lib/utils";

function TooltipProvider({
    delayDuration = 300,
    skipDelayDuration = 100,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delayDuration={delayDuration}
            skipDelayDuration={skipDelayDuration}
            {...props}
        />
    );
}

function Tooltip({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipProvider>
            <TooltipPrimitive.Root data-slot="tooltip" {...props} />
        </TooltipProvider>
    );
}

function TooltipTrigger({
    asChild,
    children,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
    // If consumer didn't opt into asChild, we wrap in a safe button type="button" to avoid submit.
    if (!asChild) {
        return (
            <TooltipPrimitive.Trigger
                data-slot="tooltip-trigger"
                asChild
                {...props}
            >
                <button
                    type="button"
                    // Ensure unstyled baseline; consumer classes still pass via props.className on Trigger
                    className={cn("inline-flex", props.className)}
                    onClick={(e) => {
                        // Prevent bubbling triggering parent form submit if any custom code interferes
                        e.stopPropagation();
                    }}
                >
                    {children}
                </button>
            </TooltipPrimitive.Trigger>
        );
    }
    return (
        <TooltipPrimitive.Trigger
            data-slot="tooltip-trigger"
            asChild={asChild}
            {...props}
        >
            {children}
        </TooltipPrimitive.Trigger>
    );
}

function TooltipContent({
    className,
    sideOffset = 0,
    children,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                data-slot="tooltip-content"
                sideOffset={sideOffset}
                className={cn(
                    "max-w-sm bg-[var(--color-tooltip-bg)] text-[var(--color-tooltip-text)] border border-[var(--color-tooltip-border)] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[9999] w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-2 text-xs shadow-lg",
                    className,
                )}
                {...props}
            >
                {children}
                <TooltipPrimitive.Arrow className="opt-tooltip-arrow bg-[var(--color-tooltip-bg)] fill-[var(--color-tooltip-bg)] z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

// If this module is evaluated more than once, prevent duplicate registrations.
window?.wp?.hooks?.removeFilter?.("optiontics_tooltip", "optiontics");
window?.wp?.hooks?.removeFilter?.("optiontics_tooltip_trigger", "optiontics");
window?.wp?.hooks?.removeFilter?.("optiontics_tooltip_content", "optiontics");
window?.wp?.hooks?.removeFilter?.("optiontics_tooltip_provider", "optiontics");

window?.wp?.hooks?.addFilter?.(
    "optiontics_tooltip",
    "optiontics",
    (_, props) => <Tooltip {...props} />,
    10,
);
window?.wp?.hooks?.addFilter?.(
    "optiontics_tooltip_trigger",
    "optiontics",
    (_, props) => <TooltipTrigger {...props} />,
    10,
);
window?.wp?.hooks?.addFilter?.(
    "optiontics_tooltip_content",
    "optiontics",
    (_, props) => <TooltipContent {...props} />,
    10,
);
window?.wp?.hooks?.addFilter?.(
    "optiontics_tooltip_provider",
    "optiontics",
    (_, props) => <TooltipProvider {...props} />,
    10,
);
