/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { AddOptionsButton, Container } from "@/common/components";
import { PageHeader } from "@/common/components/layouts/PageHeader";
import {
	TotalOptionSetsIcon,
	ActiveOptionSetsIcon,
	ProductsUsingOptionsIcon,
	RevenueWithOptionsIcon,
	OrdersWithOptionsIcon,
	ConversionRateIcon,
} from "@/common/icons";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { MetricCard } from "./components/MetricCard";
import { RevenueChart } from "./components/RevenueChart";
import { ProductPerformanceTable } from "./components/ProductPerformanceTable";
import { useAnalytics } from "./hooks/useAnalytics";
import type { AnalyticsSummary, DateRange } from "@/api/analytics";

// ─── Trend helpers ────────────────────────────────────────────────────────────

function pctChange(current: number, prev: number): number | null {
	if (prev === 0) return current > 0 ? 100 : null;
	return parseFloat((((current - prev) / prev) * 100).toFixed(1));
}

function buildTrend(
	summary: AnalyticsSummary | null,
	range: DateRange,
	field: "revenue" | "orders" | "conversion",
): number | null {
	if (!summary || range === "all") return null;
	switch (field) {
		case "revenue":
			return pctChange(summary.revenue_with_options, summary.prev_revenue);
		case "orders":
			return pctChange(summary.orders_with_options, summary.prev_orders);
		case "conversion":
			return pctChange(summary.conversion_rate, summary.prev_conversion_rate);
		default:
			return null;
	}
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const AnalyticsPage = () => {
	const {
		summary,
		chartData,
		productPerformance,
		loadingSummary,
		loadingChart,
		loadingProducts,
		dateRange,
		handleRangeChange,
	} = useAnalytics();

	useEffect(() => {
		document.documentElement.classList.remove("optiontics-builder-active");
	}, []);

	const revenueTrend    = buildTrend(summary, dateRange, "revenue");
	const ordersTrend     = buildTrend(summary, dateRange, "orders");
	const conversionTrend = buildTrend(summary, dateRange, "conversion");

	return (
		<Container className="space-y-0">
			<PageHeader
				title={__("Analytics", "optiontics")}
				actions={<AddOptionsButton />}
			/>

			<div className="px-8 space-y-6 pb-8">
				<div className="p-6 bg-white border border-[#CBD8EA] rounded-xl">
					{/* Date range filter */}
					<div className="flex items-center justify-end mb-5">
						<DateRangeFilter value={dateRange} onChange={handleRangeChange} />
					</div>

					{/* KPI cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
						<MetricCard
							title={__("Total Option Sets", "optiontics")}
							value={summary?.total_options ?? 0}
							trend={null}
							icon={<TotalOptionSetsIcon color="white" />}
							iconBg="bg-blue-500"
							loading={loadingSummary}
							tooltip={__("Total number of option sets created in your store.", "optiontics")}
						/>
						<MetricCard
							title={__("Active Option Sets", "optiontics")}
							value={summary?.active_options ?? 0}
							trend={null}
							icon={<ActiveOptionSetsIcon color="white" />}
							iconBg="bg-green-500"
							loading={loadingSummary}
							tooltip={__("Option sets currently published and visible to customers.", "optiontics")}
						/>
						<MetricCard
							title={__("Products Using Options", "optiontics")}
							value={summary?.products_using_options ?? 0}
							trend={null}
							icon={<ProductsUsingOptionsIcon color="white" />}
							iconBg="bg-purple-600"
							loading={loadingSummary}
							tooltip={__("Number of products that have at least one option set assigned.", "optiontics")}
						/>
						<MetricCard
							title={__("Revenue with Options", "optiontics")}
							value={
								summary
									? `$${summary.revenue_with_options.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}`
									: "$0.00"
							}
							trend={revenueTrend}
							icon={<RevenueWithOptionsIcon color="white" />}
							iconBg="bg-[#00BC7D]"
							loading={loadingSummary}
							tooltip={__("Total revenue generated from orders that included custom options.", "optiontics")}
						/>
						<MetricCard
							title={__("Orders with Options", "optiontics")}
							value={summary?.orders_with_options ?? 0}
							trend={ordersTrend}
							icon={<OrdersWithOptionsIcon color="white" />}
							iconBg="bg-orange-500"
							loading={loadingSummary}
							tooltip={__("Number of orders where customers selected at least one custom option.", "optiontics")}
						/>
						<MetricCard
							title={__("Conversion Rate", "optiontics")}
							value={summary ? `${summary.conversion_rate}%` : "0%"}
							trend={conversionTrend}
							icon={<ConversionRateIcon color="white" />}
							iconBg="bg-[#F6339A]"
							loading={loadingSummary}
							tooltip={__("Percentage of orders that included custom options out of all orders.", "optiontics")}
						/>
					</div>

					{/* Revenue chart */}
					<RevenueChart data={chartData} loading={loadingChart} />
				</div>

				{/* Product performance */}
				<ProductPerformanceTable data={productPerformance} loading={loadingProducts} />
			</div>
		</Container>
	);
};

export default AnalyticsPage;
