/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useMemo } from "@wordpress/element";

/**
 * External dependencies
 */
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from "recharts";

/**
 * Internal dependencies
 */
import { Skeleton } from "@/shadcn/components/ui/skeleton";
import type { RevenueChartItem } from "@/api/analytics";

interface Props {
	data: RevenueChartItem[];
	loading?: boolean;
}

function formatMonth(yearMonth: string): string {
	const [year, month] = yearMonth.split("-");
	const date = new Date(Number(year), Number(month) - 1, 1);
	return date.toLocaleString("default", { month: "short" });
}

function formatYAxis(value: number): string {
	if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
	if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
	return `$${value}`;
}

function CustomTooltip({
	active,
	payload,
	label,
}: {
	active?: boolean;
	payload?: { value: number }[];
	label?: string;
}) {
	if (!active || !payload?.length) return null;
	const revenue = payload[0]?.value ?? 0;
	return (
		<div
			className="rounded-lg border bg-white shadow-sm px-3 py-2 text-sm"
			style={{ borderColor: "var(--opt-border)" }}
		>
			<p className="font-semibold" style={{ color: "var(--opt-text-default)" }}>
				{label}
			</p>
			<p style={{ color: "var(--opt-text-tertiary)" }}>
				{__("Revenue", "optiontics")}:{" "}
				<span className="font-medium" style={{ color: "var(--opt-text-default)" }}>
					${revenue.toLocaleString()}
				</span>
			</p>
		</div>
	);
}

export function RevenueChart({ data, loading = false }: Props) {
	const chartData = useMemo(
		() => data.map((d) => ({ ...d, label: formatMonth(d.month) })),
		[data],
	);

	return (
		<div
			className="rounded-[6px] border bg-white p-5"
			style={{ borderColor: "var(--opt-border)" }}
		>
			<h3
				className="text-base font-semibold mt-0!"
				style={{ color: "var(--opt-text-default)", marginBottom: "30px" }}
			>
				{__("Revenue from Options", "optiontics")}
			</h3>

			{loading ? (
				<Skeleton className="h-[220px] w-full" />
			) : (
				<ResponsiveContainer width="100%" height={220}>
					<LineChart
						data={chartData}
						margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#eae6e6"
							vertical={true}
						/>
						<XAxis
							dataKey="label"
							tick={{ fontSize: 11, fill: "#9ca3af" }}
							axisLine={false}
							tickLine={false}
						/>
						<YAxis
							tickFormatter={formatYAxis}
							tick={{ fontSize: 11, fill: "#9ca3af" }}
							axisLine={false}
							tickLine={false}
							width={52}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Line
							type="monotone"
							dataKey="revenue"
							stroke="var(--opt-primary)"
							strokeWidth={2}
							dot={false}
							activeDot={{ r: 4, fill: "var(--opt-primary)" }}
						/>
					</LineChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}
