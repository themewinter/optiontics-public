import ApiBase from "@/api/api-base";
import { API_PATH_PREFIX } from "@/globalConstant";

export type DateRange = "all" | "30_days" | "7_days" | "today";

export interface AnalyticsSummary {
    total_options: number;
    active_options: number;
    products_using_options: number;
    revenue_with_options: number;
    orders_with_options: number;
    conversion_rate: number;
    prev_revenue: number;
    prev_orders: number;
    prev_conversion_rate: number;
}

export interface RevenueChartItem {
    month: string;  // "YYYY-MM"
    revenue: number;
}

export interface ProductPerformanceItem {
    product_id: number;
    product_name: string;
    revenue: number;
    order_count: number;
    option_count: number;
    growth: number;
}

export default class Analytics extends ApiBase {
    override prefix: string = `${API_PATH_PREFIX}/analytics`;

    async getSummary(dateRange: DateRange = "all"): Promise<any> {
        return this.get("summary", { date_range: dateRange });
    }

    async getRevenueChart(): Promise<any> {
        return this.get("revenue-chart");
    }

    async getProductPerformance(dateRange: DateRange = "all"): Promise<any> {
        return this.get("product-performance", { date_range: dateRange });
    }
}
