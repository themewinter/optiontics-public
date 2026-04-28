import * as React from "@wordpress/element";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";

type SwitchProps = React.ComponentPropsWithoutRef<
    typeof SwitchPrimitive.Root
> & {
    loading?: boolean;
};

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    SwitchProps
>(({ className, loading = false, disabled, ...props }, ref) => {
    const isDisabled = !!disabled || !!loading;

    return (
        <div className="w-11 leading-none">
            <SwitchPrimitive.Root
                ref={ref}
                disabled={isDisabled}
                aria-busy={loading || undefined}
                className={cn(
                    // Base styles
                    "opt-switch relative inline-flex h-6 w-11 items-center rounded-full bg-input transition-colors",
                    // Checked state
                    "data-[state=checked]:bg-primary",
                    // Disabled: reduce opacity & adjust color subtlety (even if checked)
                    isDisabled &&
                        "opacity-60 data-[state=checked]:bg-primary/70",
                    isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                    className,
                )}
                {...props}
            >
                <SwitchPrimitive.Thumb
                    className={cn(
                        "opt-switch-thumb pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-background shadow transition-transform duration-200 data-[state=checked]:translate-x-5",
                        "flex items-center justify-center",
                    )}
                >
                    {loading && (
                        <LoaderCircle className="h-2.5 w-2.5 animate-spin text-muted-foreground" />
                    )}
                </SwitchPrimitive.Thumb>
            </SwitchPrimitive.Root>
        </div>
    );
});

Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
