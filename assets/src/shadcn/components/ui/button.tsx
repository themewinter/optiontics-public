import * as React from "@wordpress/element";
import { LoaderCircle } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shadcn/lib/utils";

const buttonVariants = cva(
    "flt-btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer disabled:cursor-not-allowed rounded-[6px]",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-neutral-100 hover:bg-primary-400 active:bg-primary-400 disabled:bg-primary-200",
                outline:
                    "border border-gray-300 bg-white text-neutral-400 hover:bg-gray-50",
                ghost: "text-neutral-500 hover:bg-neutral-200",
                link: "underline-offset-4 hover:underline",
                outlinePrimary:
                    "border border-primary bg-white text-primary hover:bg-primary/10",
                outlineDark:
                    "border border-neutral-400 text-neutral-500 hover:text-primary-400 hover:border-primary-400",
                ghostPrimary: "text-primary hover:bg-primary/10",
                softPrimary:
                    "bg-primary/10 text-primary hover:text-primary-300",
                softSecondary:
                    "bg-neutral-200 text-gray-800 text-gray-900 hover:bg-visual-300",
                lightOutline:
                    "bg-neutral-white text-[13px]! border border-concitional-stock text-neutral-light hover:text-neutral-400 hover:border-visual-300",
                infoOutline:
                    "bg-neutral-white border border-info text-info hover:text-info/70 hover:border-info/70",
                icon: "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700 rounded-full border-0",
                danger: "bg-neutral-200 text-visual-400 hover:text-danger hover:bg-danger/10",
            },
            size: {
                // Default button now auto-scales: slightly more compact on very small screens
                default:
                    "h-10 px-4 text-sm has-[>svg]:px-3 sm:h-11 sm:px-6 sm:text-base",
                // Small stays small; no further downscale needed
                sm: "h-8 text-sm! rounded-[4px] font-normal! gap-1.5 px-3 has-[>svg]:px-2.5",
                // Large variant grows a bit on larger breakpoints
                lg: "h-10 px-5 has-[>svg]:px-4 sm:h-12 sm:px-8 sm:text-base",
                // Icon sizes shrink slightly on very small screens
                icon: "size-8 sm:size-9",
                iconCircle:
                    "size-8 sm:size-9 rounded-full p-0 flex items-center justify-center",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

const Button = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<"button"> &
        VariantProps<typeof buttonVariants> & {
            asChild?: boolean;
            loading?: boolean;
        }
>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            loading = false,
            children,
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                ref={ref}
                className={cn(
                    buttonVariants({ variant, size }),
                    className,
                    loading && "pointer-events-none opacity-80",
                )}
                disabled={loading || props.disabled}
                {...props}
            >
                {loading ? (
                    <div className="flex gap-2 items-center">
                        {children}{" "}
                        <LoaderCircle className="animate-spin size-4" />
                    </div>
                ) : (
                    children
                )}
            </Comp>
        );
    },
);

Button.displayName = "Button";

export { Button, buttonVariants };

// If this module is evaluated more than once, prevent duplicate registrations.
window?.wp?.hooks?.removeFilter?.("optiontics_button", "optiontics");

window?.wp?.hooks?.addFilter?.(
    "optiontics_button",
    "optiontics",
    (_, props) => <Button {...props} />,
    10,
);
