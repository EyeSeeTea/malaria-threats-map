import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { ApiParams, ApiResponse, XMartApiResponse } from "../common/types";
import { DiagnosisRepository } from "../../domain/repositories/DiagnosisRepository";
import { DiagnosisStudy } from "../../domain/entities/DiagnosisStudy";
import { Future } from "../../common/Future";

export class DiagnosisApiRepository implements DiagnosisRepository {
    constructor(private arcGisBaseUrl: string, private xmartBaseUrl: string) {}

    getStudies(): FutureData<DiagnosisStudy[]> {
        const params: ApiParams = {
            f: "json",
            where: `1=1`,
            outFields: "*",
        };

        return Future.joinObj({
            diagnosisArcGis: request<ApiResponse<DiagnosisStudy>>({ url: `${this.arcGisBaseUrl}/7/query`, params }).map(
                response => response.features.map(feature => feature.attributes)
            ),
            diagnosisHrp23Studies: request<XMartApiResponse<DiagnosisStudy>>({
                url: `${this.xmartBaseUrl}/FACT_HRPO_VIEW`,
            }).map(response => response.value),
        }).map(({ diagnosisArcGis, diagnosisHrp23Studies }) => {
            return [...diagnosisArcGis, ...diagnosisHrp23Studies];
        });
    }
}
