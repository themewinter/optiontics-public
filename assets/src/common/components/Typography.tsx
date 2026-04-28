/**
 * Internal Dependencies
 */
import { cn } from "@/shadcn/lib/utils";

// === Shared props (simplified to avoid direct React type dependency) ===
type TypographyProps = {
    className?: string;
    [key: string]: any;
};

export const SectionTitle = ({ className, ...props }: TypographyProps) => (
    <div
        className={cn(
            "text-card-foreground font-bold",
            "text-[22px] leading-[28px]",
            "sm:text-[26px] sm:leading-[32px]",
            "md:text-[30px] md:leading-[36px]",
            className,
        )}
        {...props}
    />
);

// === Muted text ===
export const Muted = ({ className, ...props }: TypographyProps) => (
    <div
        className={cn(
            "text-muted-foreground text-sm font-normal leading-[20px]",
            className,
        )}
        {...props}
    />
);

export const Description = ({ className, ...props }: TypographyProps) => (
    <div className={cn("text-neutral-400 font-normal", className)} {...props} />
);
