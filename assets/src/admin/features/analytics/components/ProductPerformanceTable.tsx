/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Table } from "@/common/components/table";
import type { TableColumn } from "@/common/components/table";
import type { ProductPerformanceItem } from "@/api/analytics";

function HeaderLabel({ text }: { text: string }) {
	return (
		<span
			className="text-sm font-medium tracking-wide whitespace-nowrap"
			style={{ color: "var(--opt-text-secondary)" }}
		>
			{text}
		</span>
	);
}

function GrowthBadge({ growth }: { growth: number }) {
	const isPositive = growth >= 0;
	return (
		<span
			className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
			style={{
				backgroundColor: isPositive ? "#ecfdf5" : "#fef2f2",
				color: isPositive ? "#059669" : "#dc2626",
			}}
		>
			{isPositive ? "+" : ""}
			{growth.toFixed(1)}%
		</span>
	);
}

const columns: TableColumn[] = [
	{
		key: "product_name",
		title: <HeaderLabel text={__("Product", "optiontics")} />,
		dataIndex: "product_name",
		width: 250,
		render: (value: string) => (
			<span
				className="text-sm font-medium truncate block max-w-[220px]"
				style={{ color: "var(--opt-text-default)" }}
				title={value}
			>
				{value}
			</span>
		),
	},
	{
		key: "option_count",
		title: <HeaderLabel text={__("Options", "optiontics")} />,
		dataIndex: "option_count",
		width: 100,
		render: (value: number) => (
			<span className="text-sm" style={{ color: "var(--opt-text-default)" }}>
				{value}
			</span>
		),
	},
	{
		key: "order_count",
		title: <HeaderLabel text={__("Orders", "optiontics")} />,
		dataIndex: "order_count",
		width: 100,
		render: (value: number) => (
			<span className="text-sm" style={{ color: "var(--opt-text-default)" }}>
				{value.toLocaleString()}
			</span>
		),
	},
	{
		key: "revenue",
		title: <HeaderLabel text={__("Revenue", "optiontics")} />,
		dataIndex: "revenue",
		width: 100,
		render: (value: number) => (
			<span className="text-sm font-semibold" style={{ color: "var(--opt-text-default)" }}>
				${value.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}
			</span>
		),
	},
	{
		key: "growth",
		title: <HeaderLabel text={__("Growth", "optiontics")} />,
		dataIndex: "growth",
		width: 100,
		render: (value: number) => <GrowthBadge growth={value} />,
	},
];

interface Props {
	data: ProductPerformanceItem[];
	loading?: boolean;
}

export function ProductPerformanceTable({ data, loading = false }: Props) {
	return (
		<div
			className="rounded-xl border bg-white p-5"
			style={{ borderColor: "var(--opt-border)" }}
		>
			<h3
				className="text-base font-semibold mt-0! mb-8"
				style={{ color: "var(--opt-text-default)" }}
			>
				{__("Product-wise Performance", "optiontics")}
			</h3>

			<Table
				dataSource={data}
				columns={columns}
				rowKey="product_id"
				loading={loading}
				emptyText={__("No product data for this period.", "optiontics")}
				containerClassName="border-0 bg-transparent rounded-none"
			/>
		</div>
	);
}
