import type { ReactNode } from "@wordpress/element";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "./ui/Button";

type AlertNoticeVariant = "warning" | "danger" | "info";

export interface AlertNoticeProps {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    variant?: AlertNoticeVariant;
    className?: string;
    icon?: ReactNode;
}

const variantStyles: Record<AlertNoticeVariant, { wrapper: string; title: string; description: string; button: string }> = {
    warning: {
        wrapper: "border-amber-200 bg-amber-50",
        title: "text-amber-800",
        description: "text-amber-700",
        button: "border-amber-300 text-amber-800 hover:bg-amber-100",
    },
    danger: {
        wrapper: "border-red-200 bg-red-50",
        title: "text-red-800",
        description: "text-red-600",
        button: "border-red-300 text-red-700 hover:bg-red-100",
    },
    info: {
        wrapper: "border-blue-200 bg-blue-50",
        title: "text-blue-800",
        description: "text-blue-700",
        button: "border-blue-300 text-blue-800 hover:bg-blue-100",
    },
};

export function AlertNotice({
    title,
    description,
    actionLabel,
    onAction,
    variant = "warning",
    className,
    icon,
}: AlertNoticeProps) {
    const styles = variantStyles[variant];

    return (
        <div className={cn("flex items-center gap-4 rounded-lg border p-4", styles.wrapper, className)}>
            {icon && (
                <span className="shrink-0">{icon}</span>
            )}

            <div className="flex-1 min-w-0">
                <p className={cn("text-[15px] font-medium leading-snug m-0", styles.title)} style={{margin: "0"}}>
                    {title}
                </p>
                {description && (
                    <p className={cn("mt-0.5 text-sm m-0", styles.description)} style={{margin: "0"}}>
                        {description}
                    </p>
                )}
            </div>

            {actionLabel && onAction && (
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onAction}
                    className={cn("shrink-0", styles.button)}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
