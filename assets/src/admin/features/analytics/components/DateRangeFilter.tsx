/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Button } from "@/common/components/ui/Button";
import { cn } from "@/shadcn/lib/utils";
import type { DateRange } from "@/api/analytics";

interface Props {
	value: DateRange;
	onChange: (range: DateRange) => void;
}

const OPTIONS: { label: string; value: DateRange }[] = [
	{ label: __("All Days", "optiontics"), value: "all" },
	{ label: __("30 Days", "optiontics"), value: "30_days" },
	{ label: __("7 Days", "optiontics"), value: "7_days" },
	{ label: __("Today", "optiontics"), value: "today" },
];

export function DateRangeFilter({ value, onChange }: Props) {
	return (
		<div
			className="flex items-center rounded-lg border bg-white p-1 gap-0.5"
			style={{ borderColor: "var(--opt-border)" }}
		>
			{OPTIONS.map((opt) => (
				<Button
					key={opt.value}
					variant={value === opt.value ? "primary" : "ghost"}
					size="sm"
					onClick={() => onChange(opt.value)}
					className={cn(
						"font-medium",
						value !== opt.value && "hover:bg-[var(--opt-secondary-soft)]",
					)}
				>
					{opt.label}
				</Button>
			))}
		</div>
	);
}
