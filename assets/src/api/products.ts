
import ApiBase from "@/api/api-base";
import { API_PATH_PREFIX } from "@/globalConstant";

export default class Products extends ApiBase {
    override prefix: string = `${API_PATH_PREFIX}`;

    async getProducts(params: Record<string, any>): Promise<any> {
        return this.get("products", params);
    }
    async getCategories(params: Record<string, any>): Promise<any> {
        return this.get("product-categories", params);
    }
}
