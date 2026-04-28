/**
 * WordPress dependencies
 */
import apiFetch from "@wordpress/api-fetch";

/**
 * External Dependencies
 */
import { toast } from "sonner";

/**
 * Function to handle notifications based on API response.
 * @param res - API response object.
 * @param method - HTTP method used in the request.
 */

const notify = ({ res, method }: NotifyParams): void => {
    if (method !== "GET") {
        // Handle regular API responses which are wrapped in a common response format
        const type = res?.success ? "success" : "error";
        toast[type](res?.message);
    } else if (method === "GET" && !res?.success) {
        if (Array.isArray(res)) return;
        toast.error(res?.message);
    }
};

export default class ApiBase {
    private apiFetch: typeof apiFetch;
    protected prefix: string;

    constructor(prefix: string = "") {
        this.apiFetch = apiFetch;
        this.prefix = prefix;
    }

    /**
     * Add prefix to the path.
     * @param path - The endpoint path.
     * @returns The full path with the prefix.
     */
    private addPrefix(path: string): string {
        return path ? `${this.prefix}/${path}` : this.prefix;
    }

    /**
     * Build query parameters string from an object.
     * @param params - The query parameters.
     * @returns The query string.
     */
    private buildQueryParams(params: Record<string, any> = {}): string {
        const queryString = new URLSearchParams(params).toString();
        return queryString ? `?${queryString}` : "";
    }

    /**
     * Send API request.
     * @param params - The request options.
     * @returns The API response in JSON format.
     */
    async sendRequest(params: SendRequestParams = {}): Promise<ApiResponse> {
        const {
            path = "",
            method = "GET",
            data = {},
            showToast = true,
        } = params;
        const isGet = method === "GET";
        const fullPath = isGet ? path : this.addPrefix(path);

        const fetchParams: Record<string, any> = {
            method,
            ...(isGet ? {} : { data }),
            path: fullPath,
            ...(data?.format === "csv" ? { parse: false } : {}),
        };

        try {
            const res = await this.apiFetch(fetchParams);
            if (showToast) {
                notify({ res, method });
            }
            return res;
        } catch (error: any) {
            notify({ res: error, method });
            throw error;
        }
    }

    /**
     * Send a GET request.
     * @param path - The endpoint path.
     * @param params - The query parameters.
     * @returns The API response.
     */
    async get(
        path: string,
        params?: Record<string, any>,
    ): Promise<ApiResponse> {
        const method = "GET";
        const queryString = this.buildQueryParams(params);
        const fullPath = `${this.addPrefix(path)}${queryString}`;
        const res = await this.sendRequest({ path: fullPath, method });
        return res;
    }

    /**
     * Send a POST request.
     * @param path - The endpoint path.
     * @param data - The request data.
     * @returns The API response.
     */
    async post(
        path: string,
        data: Record<string, any> = {},
        showToast: boolean = true,
    ): Promise<ApiResponse> {
        const method = "POST";
        const res = await this.sendRequest({
            path,
            method,
            data,
            showToast,
        });
        return res;
    }

    /**
     * Send a PUT request.
     * @param path - The endpoint path.
     * @param data - The request data.
     * @returns The API response.
     */
    async put(
        path: string,
        data: Record<string, any> = {},
        showToast: boolean = true,
    ): Promise<ApiResponse> {
        const method = "PUT";
        const res = await this.sendRequest({ path, method, data, showToast });
        return res;
    }

    /**
     * Send a DELETE request.
     * @param path - The endpoint path.
     * @param data - The request data.
     * @returns The API response.
     */
    async delete(
        path: string,
        data?: Record<string, any>,
    ): Promise<ApiResponse> {
        const method = "DELETE";
        const res = await this.sendRequest({ path, method, data });
        return res;
    }
}
