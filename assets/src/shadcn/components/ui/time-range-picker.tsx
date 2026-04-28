"use client";

/**
 * Simple TimeRangePicker component
 * - Displays a single input-like trigger showing formatted time range (e.g. 10:00 AM - 04:00 PM)
 * - Opens a popover with two HTML5 time inputs (start & end)
 * - 12-hour display formatting, stores 24-hour values
 */
import * as React from "@wordpress/element";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcn/components/ui/popover";
import { cn } from "@/shadcn/lib/utils";
import { Clock } from "lucide-react";

export interface TimeRangeValue {
    start?: string; // 24h format HH:MM
    end?: string; // 24h format HH:MM
}

export interface TimeRangePickerProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value?: TimeRangeValue;
    onChange?: (value: TimeRangeValue) => void; // custom change signature
    disabled?: boolean;
    align?: "start" | "center" | "end";
    /**  interval minutes list step used for native input UI hints  */
    step?: number; // seconds
    /** placeholder when no value */
    placeholder?: string;
}

// Convert 24h ("14:30") to 12h display ("2:30 PM")
function formatDisplay(time?: string) {
    if (!time) return "";
    const parts = time.split(":");
    const hStr = parts[0] ?? "00";
    const m = parts[1] ?? "00";
    let h = parseInt(hStr, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${h.toString().padStart(1, "0")}:${m} ${suffix}`; // padStart(1) keeps single digit
}

// Ensure value stored is in 24h already; native time input returns 24h.
export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
    value,
    onChange,
    disabled,
    className,
    align = "start",
    step = 60,
    placeholder = "--:-- -- - --:-- --",
    ...rest
}) => {
    const [open, setOpen] = React.useState(false);
    const start = value?.start;
    const end = value?.end;

    const display =
        start && end
            ? `${formatDisplay(start)} - ${formatDisplay(end)}`
            : start
            ? `${formatDisplay(start)} - --:--`
            : end
            ? `--:-- - ${formatDisplay(end)}`
            : "";

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = e.target.value || undefined;
        onChange?.({ start: newStart, end });
    };
    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEnd = e.target.value || undefined;
        onChange?.({ start, end: newEnd });
    };

    const clear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.({ start: undefined, end: undefined });
    };

    return (
        <div className={cn("w-full", className)} {...rest}>
            <Popover open={open} onOpenChange={(o) => !disabled && setOpen(o)}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        className={cn(
                            "flex w-full items-center justify-between rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                    >
                        <span
                            className={cn(
                                "truncate text-left",
                                !display && "text-muted-foreground",
                            )}
                        >
                            {display || placeholder}
                        </span>
                        <Clock className="ml-3 h-4 w-4 shrink-0 opacity-70" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    align={align}
                    className="w-[260px] p-4 space-y-4"
                >
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-xs font-medium text-muted-foreground w-14">
                                Start
                            </label>
                            <input
                                type="time"
                                value={start || ""}
                                step={step}
                                onChange={handleStartChange}
                                className="flex-1 h-10 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-xs font-medium text-muted-foreground w-14">
                                End
                            </label>
                            <input
                                type="time"
                                value={end || ""}
                                step={step}
                                onChange={handleEndChange}
                                className="flex-1 h-10 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                            />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                            <button
                                type="button"
                                onClick={clear}
                                className="text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

TimeRangePicker.displayName = "TimeRangePicker";

export default TimeRangePicker;
