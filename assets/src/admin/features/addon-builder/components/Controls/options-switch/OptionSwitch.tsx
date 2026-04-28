/**
 * WordPress dependencies
 */
import type { ReactNode } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { cn } from "@/shadcn/lib/utils";
import { Switch } from "@/shadcn/components/ui";

export interface OptionSwitchProps {
	label: ReactNode;
	description?: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
}

/**
 * OptionSwitch — a reusable labelled switch row.
 */
export function OptionSwitch({
	label,
	description,
	checked,
	onChange,
	disabled,
	className,
}: OptionSwitchProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between gap-4",
				"rounded-[4px] border border-gray-200 bg-white px-4 py-[12px]",
				"transition-colors duration-150",
				disabled && "pointer-events-none",
				className,
			)}
		>
			<div className="flex min-w-0 flex-col gap-0.5">
				<span className="text-sm font-medium leading-5 text-gray-700 inline-flex items-center gap-2">
					{label}
				</span>
				{description && (
					<span className="text-xs leading-4 text-[#9CA3AF">
						{description}
					</span>
				)}
			</div>
			<Switch checked={checked} onCheckedChange={onChange} disabled={disabled}  />
		</div>
	);
}
