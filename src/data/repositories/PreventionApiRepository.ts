
import { request } from "../common/request"
import { FutureData } from "../../domain/common/FutureData";
import { PreventionStudy } from "../../domain/entities/PreventionStudy";
import { PreventionRepository } from "../../domain/repositories/PreventionRepository";
import { ApiResponse, ApiParams } from "../common/types";

export class PreventionApiRepository implements PreventionRepository {
    constructor(private baseUrl: string) { }

    getStudies(): FutureData<PreventionStudy[]> {
        const params: ApiParams = {
            f: "json",
            where: `1=1`,
            outFields: "*",
        };

        return request<ApiResponse<PreventionStudy>>({ url: `${this.baseUrl}/5/query`, params })
            .map(response => response.features.map((feature) => feature.attributes));
    }
}