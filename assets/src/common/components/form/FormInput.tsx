/**
 * External Dependencies
 */
import { Info } from "lucide-react";

/**
 * Internal Dependencies
 */
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shadcn/components/ui";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";
import { cn } from "@/shadcn/lib/utils";

interface FormInputProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: any;
    name: string;
    label?: React.ReactNode;
    inputField: (field: any) => React.ReactNode;
    required?: boolean;
    inlineLabel?: React.ReactNode;
    tooltip?: string;
}

export const FormInput = ({
    control,
    name = "",
    label,
    inputField,
    required = false,
    inlineLabel,
    tooltip,
}: FormInputProps) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                {label ? (
                    <FormLabel htmlFor={name} className="text-neutral-500">
                        {label}
                        {required ? (
                            <span className="text-danger">*</span>
                        ) : null}
                        {tooltip ? (
                            <Tooltip delayDuration={300}>
                                <TooltipTrigger
                                    className="opt-form-input-tooltip-trigger ml-2"
                                    onFocus={(e) => e.preventDefault()}
                                    tabIndex={-1}
                                >
                                    <Info size="16px" />
                                </TooltipTrigger>
                                <TooltipContent className="py-1.5 px-2 text-sm max-w-xs">
                                    {tooltip}
                                </TooltipContent>
                            </Tooltip>
                        ) : null}
                    </FormLabel>
                ) : null}
                <div className={cn(inlineLabel && "flex items-center gap-1")}>
                    <FormControl>{inputField({ ...field })}</FormControl>
                    {inlineLabel ? (
                        <label
                            htmlFor={name}
                            className="text-neutral-400 font-medium cursor-pointer"
                        >
                            {inlineLabel}
                        </label>
                    ) : null}
                </div>
                <FormMessage />
            </FormItem>
        )}
    />
);
