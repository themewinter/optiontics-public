/**
 * WordPress dependencies
 */
import { useState, useEffect, useCallback } from "@wordpress/element";

/**
 * Internal dependencies
 */
import Api from "@/api";
import type {
    DateRange,
    AnalyticsSummary,
    RevenueChartItem,
    ProductPerformanceItem,
} from "@/api/analytics";

interface AnalyticsState {
    summary: AnalyticsSummary | null;
    chartData: RevenueChartItem[];
    productPerformance: ProductPerformanceItem[];
    loadingSummary: boolean;
    loadingChart: boolean;
    loadingProducts: boolean;
    error: string | null;
}

const initialState: AnalyticsState = {
    summary: null,
    chartData: [],
    productPerformance: [],
    loadingSummary: false,
    loadingChart: false,
    loadingProducts: false,
    error: null,
};

export function useAnalytics() {
    const [state, setState] = useState<AnalyticsState>(initialState);
    const [dateRange, setDateRange] = useState<DateRange>("all");

    const fetchSummary = useCallback(
        async (range: DateRange) => {
            setState((s) => ({ ...s, loadingSummary: true, error: null }));
            try {
                const res = await Api.analytics.getSummary(range);
                setState((s) => ({
                    ...s,
                    summary: res?.data ?? null,
                    loadingSummary: false,
                }));
            } catch {
                setState((s) => ({
                    ...s,
                    loadingSummary: false,
                    error: "Failed to load summary.",
                }));
            }
        },
        []
    );

    const fetchChart = useCallback(async () => {
        setState((s) => ({ ...s, loadingChart: true }));
        try {
            const res = await Api.analytics.getRevenueChart();
            setState((s) => ({
                ...s,
                chartData: res?.data?.items ?? [],
                loadingChart: false,
            }));
        } catch {
            setState((s) => ({ ...s, loadingChart: false }));
        }
    }, []);

    const fetchProducts = useCallback(
        async (range: DateRange) => {
            setState((s) => ({ ...s, loadingProducts: true }));
            try {
                const res = await Api.analytics.getProductPerformance(range);
                setState((s) => ({
                    ...s,
                    productPerformance: res?.data?.items ?? [],
                    loadingProducts: false,
                }));
            } catch {
                setState((s) => ({ ...s, loadingProducts: false }));
            }
        },
        []
    );

    // Initial load
    useEffect(() => {
        fetchSummary(dateRange);
        fetchChart();
        fetchProducts(dateRange);
    }, []);

    const handleRangeChange = useCallback(
        (range: DateRange) => {
            setDateRange(range);
            fetchSummary(range);
            fetchProducts(range);
        },
        [fetchSummary, fetchProducts]
    );

    return {
        ...state,
        dateRange,
        handleRangeChange,
    };
}
