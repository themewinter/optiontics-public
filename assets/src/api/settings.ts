/**
 * Internal dependencies
 */
import ApiBase from "@/api/api-base";
import { API_PATH_PREFIX } from "@/globalConstant";

export default class Settings extends ApiBase {
    override prefix: string = `${API_PATH_PREFIX}/settings`;

    async getSettings(): Promise<any> {
        return this.get("");
    }

    async updateSettings(data: Record<string, any>): Promise<any> {
        return this.post("", data);
    }
}
