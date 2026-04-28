import ApiBase from "@/api/api-base";
import { API_PATH_PREFIX } from "@/globalConstant";

export default class AI extends ApiBase {
    override prefix: string = `${API_PATH_PREFIX}/ai`;

    async generateOptions(prompt: string): Promise<any> {
        return this.post("generate", { prompt }, false);
    }
}
