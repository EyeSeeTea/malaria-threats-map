
import { request } from "../common/request"
import { FutureData } from "../../domain/common/FutureData";
import { ApiParams, ApiResponse } from "../common/types"
import { InvasiveRepository } from "../../domain/repositories/InvasiveRepository";
import { InvasiveStudy } from "../../domain/entities/InvasiveStudy";

export class InvasiveApiRepository implements InvasiveRepository {
    constructor(private baseUrl: string) { }

    getStudies(): FutureData<InvasiveStudy[]> {
        const params: ApiParams = {
            f: "json",
            where: `1=1`,
            outFields: "*",
        };

        return request<ApiResponse<InvasiveStudy>>({ url: `${this.baseUrl}/10/query`, params })
            .map(response => response.features.map((feature) => feature.attributes));
    }
}