import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { ApiParams, ApiResponse } from "../common/types";
import { TreatmentRepository } from "../../domain/repositories/TreatmentRepository";
import { TreatmentStudy } from "../../domain/entities/TreatmentStudy";

export class TreatmentApiRepository implements TreatmentRepository {
    constructor(private baseUrl: string) {}

    getStudies(): FutureData<TreatmentStudy[]> {
        const params: ApiParams = {
            f: "json",
            where: `1=1`,
            outFields: "*",
        };

        return request<ApiResponse<TreatmentStudy>>({ url: `${this.baseUrl}/6/query`, params }).map(response =>
            response.features.map(feature => feature.attributes)
        );
    }
}
