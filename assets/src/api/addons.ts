import { AddonListSearchQuery } from "@/admin/features/addon-builder/store/types";
import ApiBase from "@/api/api-base";
import { API_PATH_PREFIX } from "@/globalConstant";

export default class Addons extends ApiBase {
    override prefix: string = `${API_PATH_PREFIX}/option-block`;

    async createOption(data: Partial<any>): Promise<any> {
        return this.post("", data);
    }

    async updateOption(
        optionId: number,
        data: Partial<any>,
    ): Promise<any> {
        return this.put(`${optionId}`, data);
    }

    async deleteOption(optionId: number): Promise<any> {
        return this.delete(`${optionId}`);
    }

    async cloneOption(optionId: number): Promise<any> {
        return this.post(`${optionId}/clone`);
    }

    async bulkDeleteOptions(optionIds: number[]): Promise<any> {
        return this.delete("", { ids: optionIds });
    }

    async getSingleOption(optionId: number): Promise<any> {
        return this.get(`${optionId}`);
    }

    async getOptions(params: AddonListSearchQuery): Promise<any> {
        return this.get("", params);
    }
}
