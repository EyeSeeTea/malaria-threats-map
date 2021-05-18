import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { ApiParams, ApiResponse } from "../common/types";
import { DiagnosisRepository } from "../../domain/repositories/DiagnosisRepository";
import { DiagnosisStudy } from "../../domain/entities/DiagnosisStudy";

export class DiagnosisApiRepository implements DiagnosisRepository {
    constructor(private baseUrl: string) {}

    getStudies(): FutureData<DiagnosisStudy[]> {
        const params: ApiParams = {
            f: "json",
            where: `1=1`,
            outFields: "*",
        };

        return request<ApiResponse<DiagnosisStudy>>({ url: `${this.baseUrl}/7/query`, params }).map(response =>
            response.features.map(feature => feature.attributes)
        );
    }
}
