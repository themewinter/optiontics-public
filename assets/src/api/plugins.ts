/**
 * Internal dependencies
 */
import { API_PATH_PREFIX } from "@/globalConstant";
import ApiBase from "./api-base";

export default class Plugins extends ApiBase {
    override prefix: string = `${API_PATH_PREFIX}/plugins`;

    async pluginUpdate(data: Record<string, any>): Promise<any> {
        return this.put("", data);
    }
}
