/**
 * Internal dependencies
 */
import { API_PATH_PREFIX } from "@/globalConstant";
import ApiBase from "./api-base";

export default class Extensions extends ApiBase {
    override prefix: string = `${API_PATH_PREFIX}/extensions`;

    async getExtensions(params?: Record<string, any>): Promise<any> {
        return this.get("", params);
    }
}
