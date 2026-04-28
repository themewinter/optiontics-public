/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Skeleton } from "@/shadcn/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";
import { InfoAlertIcon } from "@/common/icons/InfoAlertIcon";

interface Props {
	title: string;
	value: string | number;
	trend?: number | null;
	icon: React.ReactNode;
	iconBg: string;
	loading?: boolean;
	tooltip?: string;
}

function TrendBadge({ trend }: { trend: number }) {
	const isPositive = trend >= 0;
	return (
		<span
			className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
			style={{
				backgroundColor: isPositive ? "#ecfdf5" : "#fef2f2",
				color: isPositive ? "#059669" : "#dc2626",
			}}
		>
			<span aria-hidden>{isPositive ? "↑" : "↓"}</span>
			{Math.abs(trend).toFixed(1)}%{" "}
			{__("from last period", "optiontics")}
		</span>
	);
}

export function MetricCard({ title, value, trend, icon, iconBg, loading = false, tooltip }: Props) {
	return (
		<div
			className="flex flex-col gap-3 rounded-[6px] border bg-white p-5"
			style={{ borderColor: "var(--opt-border)" }}
		>
			<div className="flex items-start justify-between">
				<div className="flex flex-col gap-4 min-w-0">
					<span
						className="flex items-center gap-1 text-sm font-medium"
						style={{ color: "var(--opt-text-tertiary)" }}
					>
						<span className="truncate">{title}</span>
						{tooltip && (
							<Tooltip delayDuration={300}>
								<TooltipTrigger
									className="shrink-0 cursor-default"
									tabIndex={-1}
									onFocus={(e) => e.preventDefault()}
								>
									<InfoAlertIcon />
								</TooltipTrigger>
								<TooltipContent className="py-1.5 px-2 text-sm max-w-xs">
									{tooltip}
								</TooltipContent>
							</Tooltip>
						)}
					</span>
					{loading ? (
						<Skeleton className="h-6 w-24 mt-1" />
					) : (
						<span
							className="text-2xl font-bold leading-none mt-1"
							style={{ color: "var(--opt-text-default)" }}
						>
							{typeof value === "number" ? value.toLocaleString() : value}
						</span>
					)}
				</div>
				<div className={`shrink-0 size-12 rounded flex items-center justify-center ${iconBg}`}>
					{icon}
				</div>
			</div>

			<div>
				{loading ? (
					<Skeleton className="h-4 w-32" />
				) : trend != null ? (
					<TrendBadge trend={trend} />
				) : (
					<span
						className="text-xs"
						style={{ color: "var(--opt-text-tertiary)" }}
					>
						{__("All time", "optiontics")}
					</span>
				)}
			</div>
		</div>
	);
}
